import logging
from enum import Enum
from typing import Any, List, Optional, Union

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.agent.workflow import AgentWorkflow, FunctionAgent
from llama_index.core.tools import FunctionTool, QueryEngineTool
from llama_index.readers.web import SimpleWebPageReader
from pydantic import BaseModel, Field, FileUrl, HttpUrl

from .config import LLMConfig
from .providers.providers import Provider, Providers
from .tools.download_pdf import download_pdfs

logger = logging.getLogger(__name__)


class DownloadUrls(BaseModel):
    """Data model for urls to download report from"""

    urls: List[str]


class DataSource(BaseModel):
    name: str = Field()
    description: str = Field()
    sources: List[Union[FileUrl, HttpUrl]] = Field()

    @property
    def documents(self) -> List:
        file_paths = [str(f) for f in self.sources if isinstance(f, FileUrl)]
        web_urls = [str(w) for w in self.sources if isinstance(w, HttpUrl)]
        if len(file_paths):
            return SimpleDirectoryReader(input_files=file_paths).load_data()
        if len(web_urls):
            return SimpleWebPageReader(html_to_text=True).load_data(
                urls=web_urls
            )
        raise ValueError("No data source documents found")

    def query_engine(self, provider: Provider):
        docs = VectorStoreIndex.from_documents(
            self.documents,
            embed_model=provider.embed_model(),
        )
        query_engine = docs.as_query_engine(
            llm=provider.model(),
            output_cls=DownloadUrls,
            response_mode="compact",
            system_prompt="You resolve company names and years to financial report download URLs.",
        )
        return query_engine

    def query_tool(self, provider: Provider):
        query_engine = self.query_engine(provider)
        return QueryEngineTool.from_defaults(
            query_engine=query_engine,
            name=self.name,
            description=self.description,
        )


class Agents(Enum):
    DOWNLOAD_AGENT = 1
    ANALYST_AGENT = 2


class LLM(BaseModel):
    config: LLMConfig = Field()
    data_source: DataSource = Field()
    verbose: bool = Field(default=False)

    @property
    def provider(self) -> Provider:
        provider: Provider = Providers[self.config.NAME]
        if not Provider:
            raise Exception(f"LLM Provider {self.config.name} not found")
        return provider.value(self.config)

    @property
    def download_agent(self):
        provider = self.provider
        system_prompt = """
       Your job is to help retrieve financial reports. 
       You are equipped with tools to resolve document source URLs and retrieve or downloads files on those URLs.
       Use them in sequence to obtain the required files.
        """
        description = "Query for document download urls and retrieve or download the documents"
        return FunctionAgent(
            name=Agents.DOWNLOAD_AGENT.name,
            llm=provider.model(),
            description=description,
            tools=[self.data_source.query_tool(provider), download_pdfs],
            system_prompt=system_prompt,
            verbose=self.verbose,
            can_handoff_to=[Agents.ANALYST_AGENT.name],
        )

    @property
    def analyst_tool(self):
        provider = self.provider

        def analysis_tool(
            file_paths: List[str], question: Optional[str] = None
        ) -> str:
            """Load and analyze PDFs, then answer the question or summarize."""
            documents = SimpleDirectoryReader(
                input_files=file_paths
            ).load_data()
            docs = VectorStoreIndex.from_documents(
                documents,
                embed_model=provider.embed_model(),
            )
            query_engine = docs.as_query_engine(
                llm=provider.model(),
            )
            analysis = query_engine.query(question or "Summarize the documents")
            return str(analysis)

        return FunctionTool.from_defaults(fn=analysis_tool)

    @property
    def analyst_agent(self):
        provider = self.provider
        system_prompt = """
        You are a helpful assistant for analyzing companies financial reports.
        """
        description = "Analyze companies financial reports"
        return FunctionAgent(
            name=Agents.ANALYST_AGENT.name,
            llm=provider.model(),
            description=description,
            tools=[
                self.analyst_tool,
            ],
            system_prompt=system_prompt,
            verbose=self.verbose,
        )

    def model_post_init(self, context: Any, /) -> None:
        self._workflow = AgentWorkflow(
            agents=[self.download_agent, self.analyst_agent],
            root_agent=Agents.DOWNLOAD_AGENT.name,
            initial_state={
                "file_paths": {},
            },
        )

    def query(self, query: str):
        return self._workflow.run(user_msg=query)

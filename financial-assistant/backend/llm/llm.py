import logging
from enum import Enum
from typing import Any, List, Optional, Union

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.agent.workflow import AgentWorkflow, FunctionAgent
from llama_index.core.tools import FunctionTool, QueryEngineTool
from llama_index.readers.web import SimpleWebPageReader
from pydantic import BaseModel, Field, FileUrl, HttpUrl

from llm.config import LLMConfig
from llm.providers.providers import Provider, Providers
from llm.tools.retrieve_pdf import retrieve_pdfs

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
            system_prompt="You resolve company names and years to financial documents download URLs.",
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
    DOCUMENT_AGENT = 1
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
    def document_agent(self):
        provider = self.provider
        system_prompt = """
        Your job is to Retrieve the correct financial documents (e.g. annual reports) based on the provided company name and year.
        Use tools to search, retrieve, and return the file URLs of the documents.
        """
        description = (
            "Locate and retrieve financial documents based on company and year"
        )
        return FunctionAgent(
            name=Agents.DOCUMENT_AGENT.name,
            llm=provider.model(),
            description=description,
            tools=[self.data_source.query_tool(provider), retrieve_pdfs],
            system_prompt=system_prompt,
            can_handoff_to=[Agents.ANALYST_AGENT.name],
            verbose=self.verbose,
        )

    @property
    def analyst_tool(self):
        provider = self.provider

        def analysis_tool(
            file_paths: List[str], question: Optional[str] = None
        ) -> str:
            """Analyze, summarize or compare financial reports. Your inputs should be file_paths to the reports and question"""
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
        You are a helpful assistant for analyzing, summarizing or comparing companies financial reports.
        """
        description = (
            "Analyze, summarize or compare companies financial reports"
        )
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
            agents=[self.document_agent, self.analyst_agent],
            root_agent=Agents.DOCUMENT_AGENT.name,
        )

    def query(self, query: str):
        return self._workflow.run(user_msg=query)

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
            system_prompt=(
                "Only resolve company name and year to a download URL. "
                "Do not rely on prior knowledge. "
                "Do not invent. "
                "Do not guess. "
            ),
        )
        return query_engine

    def query_tool(self, name: str, description: str, provider: Provider):
        query_engine = self.query_engine(provider)
        return QueryEngineTool.from_defaults(
            query_engine=query_engine,
            name=name,
            description=description,
        )


class Agents(Enum):
    CONCIERGE_AGENT = 1
    DOCUMENT_URL_SEARCH_AGENT = 2
    DOCUMENT_DOWNLOAD_AGENT = 3
    ANALYST_AGENT = 4


class LLM(BaseModel):
    config: LLMConfig = Field()
    document_source: DataSource = Field()
    verbose: bool = Field(default=False)

    @property
    def provider(self) -> Provider:
        provider: Provider = Providers[self.config.NAME]
        if not Provider:
            raise Exception(f"LLM Provider {self.config.name} not found")
        return provider.value(self.config)

    @property
    def document_url_search_agent(self):
        provider = self.provider
        system_prompt = f"""
        Your are the {Agents.DOCUMENT_URL_SEARCH_AGENT.name}.
        Your job is to search for financial reports download urls given company names and financial years.

        Follow these steps EXACTLY:

        1. Extract company names and years from the input. Only use those explicitly mentioned.

        2. For EACH company and year, use the tool, search_tool, to get its report download URL. Then OUTPUT:
            URLs: <comma-separated list of urls>
            QUESTION: <question>
            
        4. AFTER OUTPUT is COMPLETE, hand-off to {Agents.DOCUMENT_DOWNLOAD_AGENT.name}.
        """
        description = (
            "Search for documents download urls and hand-off"
        )
        return FunctionAgent(
            name=Agents.DOCUMENT_URL_SEARCH_AGENT.name,
            llm=provider.model(),
            description=description,
            tools=[
                self.document_source.query_tool(
                    name="search_tool",
                    description="Search for download url, given a company name and year",
                    provider=provider,
                ),
            ],
            system_prompt=system_prompt,
            can_handoff_to=[Agents.DOCUMENT_DOWNLOAD_AGENT.name],
            verbose=self.verbose,
        )

    @property
    def document_download_agent(self):
        provider = self.provider
        system_prompt = f"""
        You are the {Agents.DOCUMENT_DOWNLOAD_AGENT.name}.
        Your job is to download documents given download urls.

        Follow these steps EXACTLY:

        1. Extract download urls from the input.

        2. Use the tool, retrieve_pdfs, to download documents on those URLs.
           The tool will return local files-paths of the downloaded documents.

        3. AFTER download is complete, OUTPUT:
            FILE_PATHS: <comma-separated list of local file paths>
            QUESTION: <question>
           
        4. AFTER OUTPUT is COMPLETE, hand-off to {Agents.ANALYST_AGENT.name}.
        """
        description = (
            "Download documents, return file-urls and hand-off"
        )
        return FunctionAgent(
            name=Agents.DOCUMENT_DOWNLOAD_AGENT.name,
            llm=provider.model(),
            description=description,
            tools=[
                retrieve_pdfs,
            ],
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

    @property
    def concierge_agent(self):
        provider = self.provider
        system_prompt = f"""
        You are the {Agents.CONCIERGE_AGENT.name}.
        You review users questions on financial reports for Safaricom and Equity Bank (2021–2024 only).

        Follow these steps EXACTLY:

        1. If the question is about forecasts, stocks, investments, or non-financial topics, respond to the user:
           "I can only analyze financial reports for Safaricom and Equity Bank for 2021–2024."

        2. Extract company and year from the question:
           - Companies: Safaricom, Equity Bank
           - Years: 2021, 2022, 2023, 2024
           Accept synonyms like "both", "each", "compare".

        3. If BOTH company and year are clearly mentioned. Rephrase the question for clarity AND OUTPUT:
            COMPANIES: <comma-separated>
            YEARS: <comma-separated>
            QUESTION: <rephrased question>
            
        4. AFTER OUTPUT is COMPLETE, hand-off to {Agents.DOCUMENT_URL_SEARCH_AGENT.name}.
        """
        description = "Interpret user questions, extract key details, and hand-off valid requests."
        return FunctionAgent(
            name=Agents.CONCIERGE_AGENT.name,
            llm=provider.model(),
            description=description,
            tools=[],
            system_prompt=system_prompt,
            can_handoff_to=[Agents.DOCUMENT_URL_SEARCH_AGENT.name],
            verbose=self.verbose,
        )

    def model_post_init(self, context: Any, /) -> None:
        self._workflow = AgentWorkflow(
            agents=[
                self.concierge_agent,
                self.document_url_search_agent,
                self.document_download_agent,
                self.analyst_agent,
            ],
            root_agent=Agents.CONCIERGE_AGENT.name,
            initial_state={},
        )

    def query(self, query: str):
        return self._workflow.run(user_msg=query)

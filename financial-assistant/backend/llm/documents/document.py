from typing import List, Union

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.base.base_query_engine import BaseQueryEngine
from llama_index.core.tools import QueryEngineTool
from llama_index.readers.web import SimpleWebPageReader
from pydantic import BaseModel, FileUrl, HttpUrl

from backend.llm.providers.provider import Provider


class Document(BaseModel):
    name: str
    description: str
    sources: List[Union[FileUrl, HttpUrl]]
    download_dir: str = ".tmp/downloads"

    def docs(self, provider: Provider) -> VectorStoreIndex:
        docs = [*self._files, *self._web_pages, *self._web_pdf]
        return VectorStoreIndex.from_documents(
            docs,
            embed_model=provider.embed_model(),
        )

    def query_engine(self, provider: Provider) -> BaseQueryEngine:
        return self.docs(provider).as_query_engine(
            llm=provider.model(), similarity_top_k=3
        )

    def query_tool(self, provider: Provider):
        return QueryEngineTool.from_defaults(
            query_engine=self.query_engine(provider),
            name=self.name,
            description=self.description,
        )

    @property
    def _files(self) -> List:
        file_sources = [str(s) for s in self.sources if isinstance(s, FileUrl)]
        if not len(file_sources):
            return []
        return SimpleDirectoryReader(input_files=file_sources).load_data()

    @property
    def _web_pages(self) -> List:
        web_sources = [str(s) for s in self.sources if isinstance(s, HttpUrl)]
        if not len(web_sources):
            return []
        return SimpleWebPageReader(html_to_text=True).load_data(
            urls=web_sources
        )

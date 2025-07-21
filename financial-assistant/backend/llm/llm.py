import logging
from typing import List

from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.workflow import Context
from pydantic import BaseModel, Field

from .config import LLMConfig
from .documents.document import Document
from .providers.providers import Provider, Providers

logger = logging.getLogger(__name__)


class _QueryEngine:
    def __init__(self, context, query_engine):
        self.context = context
        self.query_engine = query_engine

    def query(self, query):
        return self.query_engine.run(query, ctx=self.context)


class LLM(BaseModel):
    config: LLMConfig = Field()
    documents: List[Document] = Field()
    tools: List = Field(default=[])
    _engine: object | None = None

    @property
    def provider(self) -> Provider:
        provider: Provider = Providers[self.config.NAME]
        if not Provider:
            raise Exception(f"LLM Provider {self.config.name} not found")
        return provider.value(self.config)

    @property
    def react_agent(self):
        provider = self.provider
        return ReActAgent(
            tools=self.query_tools(provider),
            llm=provider.model(),
        )

    def query_tools(self, provider: Provider) -> List:
        return [*self.tools, *[s.query_tool(provider) for s in self.documents]]

    def query_engine(self, clear_history: bool = False) -> _QueryEngine:
        if self._engine and not clear_history:
            return self._engine
        agent = self.react_agent
        self._engine = _QueryEngine(Context(agent), agent)
        return self._engine

    def query(self, query: str, clear_history: bool = False):
        query_engine = self.query_engine(clear_history)
        return query_engine.query(query=query)

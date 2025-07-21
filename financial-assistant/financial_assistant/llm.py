import logging
from typing import List

from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.workflow import Context
from providers.providers import Provider, Providers

from financial_assistant.config import OLLAMA, LLMConfig
from financial_assistant.data.source import Document

logger = logging.getLogger(__name__)


class QueryEngine:
    def __init__(self, context, query_engine):
        self.context = context
        self.query_engine = query_engine

    async def query(self, query):
        return self.query_engine.run(query, ctx=self.context)


class LLM:
    def __init__(
        self,
        config: LLMConfig,
        documents: List[Document],
        tools: List | None = None,
    ):
        self.config = config
        self.documents = documents
        self.tools = tools if tools else []

    @property
    def provider(self) -> Provider:
        provider: Provider = Providers[self.config.name]
        if not Provider:
            raise Exception(f"LLM Provider {self.config.name} not found")
        return provider(self.config)

    @property
    def react_agent(self):
        return ReActAgent(
            tools=self.tools,
            llm=self.provider.model(),
        )

    @property
    def query_tools(self) -> List:
        return [*self.tools, *[s.query_tool() for s in self.documents]]

    def query_engine(self, clear_history: bool = False) -> QueryEngine:
        if self._query_engine and not clear_history:
            return self._query_engine
        agent = self.react_agent
        self._query_engine = QueryEngine(Context(agent), agent)
        return self._query_engine

    async def query(self, query: str, clear_history: bool = False):
        query_engine = self.query_engine(clear_history)
        return query_engine.query(query=query)

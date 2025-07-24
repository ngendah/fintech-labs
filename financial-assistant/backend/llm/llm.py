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
    verbose: bool = Field(default=False)

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
            tools=self.agent_tools(provider),
            llm=provider.model(),
            verbos=self.verbose,
        )

    def agent_tools(self, provider: Provider) -> List:
        return [s.query_engine_tool(provider) for s in self.documents]

    def model_post_init(self, __context) -> None:
        self._agent = self.react_agent
        self._context = Context(self._agent)

    def query(self, query: str):
        return self._agent.run(query, ctx=self._context)

from abc import ABC, abstractmethod

from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.llms.llm import LLM


class Provider(ABC):
    @abstractmethod
    def embed_model(self) -> BaseEmbedding:
        raise NotImplemented()

    @abstractmethod
    def model(self) -> LLM:
        raise NotImplemented()

    @abstractmethod
    def text_embed_model(self):
        raise NotImplemented()

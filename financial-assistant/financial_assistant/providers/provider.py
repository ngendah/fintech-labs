from abc import ABC, abstractmethod

from langchain_core.language_models import BaseLanguageModel
from llama_index.core.base.embeddings.base import BaseEmbedding


class Provider(ABC):
    @abstractmethod
    def embed_model(self)->BaseEmbedding:
        raise NotImplemented()

    @abstractmethod
    def model(self)->BaseLanguageModel:
        raise NotImplemented()

    @abstractmethod
    def text_embed_model(self):
        raise NotImplemented()

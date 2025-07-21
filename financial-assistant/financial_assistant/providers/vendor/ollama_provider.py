from langchain_ollama.embeddings import (
    OllamaEmbeddings as LangChainOllamaEmbeddings,
)
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama

from financial_assistant.config import LLMConfig

from .provider import Provider


class OllamaProvider(Provider):
    def __init__(self, config: LLMConfig):
        self.config = config

    def embed_model(self):
        return OllamaEmbedding(model_name=self.config.EMBED_MODEL)

    def model(self):
        return Ollama(
            model=self.config.MODEL_NAME,
            request_timeout=self.config.TIMEOUT,
        )

    def text_embed_model(self):
        return LangChainOllamaEmbeddings(model=self.config.EMBED_MODEL)

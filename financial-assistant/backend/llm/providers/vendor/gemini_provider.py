from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from llama_index.llms.google_genai import GoogleGenAI

from llm.config import LLMConfig
from llm.providers.provider import Provider


class GeminiProvider(Provider):
    def __init__(self, config: LLMConfig):
        self.config = config

    def embed_model(self):
        return GoogleGenAIEmbedding(
            api_key=self.config.API_KEY.get_secret_value(),
            model_name=self.config.EMBED_MODEL,
        )

    def model(self):
        return GoogleGenAI(
            api_key=self.config.API_KEY.get_secret_value(),
            model=self.config.MODEL_NAME,
            request_timeout=self.config.TIMEOUT,
        )

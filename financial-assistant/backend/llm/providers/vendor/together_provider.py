from llama_index.embeddings.together import TogetherEmbedding
from llama_index.llms.together import TogetherLLM

from llm.config import LLMConfig
from llm.providers.provider import Provider


class TogetherProvider(Provider):
    def __init__(self, config: LLMConfig):
        self.config = config

    def embed_model(self):
        return TogetherEmbedding(model_name=self.config.EMBED_MODEL)

    def model(self):
        return TogetherLLM(
            model=self.config.MODEL_NAME,
            request_timeout=self.config.TIMEOUT,
        )

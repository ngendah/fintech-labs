from enum import Enum

from llm.providers.provider import Provider
from llm.providers.vendor.gemini_provider import GeminiProvider
from llm.providers.vendor.ollama_provider import OllamaProvider
from llm.providers.vendor.together_provider import TogetherProvider


class Providers(Enum):
    OLLAMA: Provider = OllamaProvider
    GEMINI: Provider = GeminiProvider
    TOGETHER: Provider = TogetherProvider

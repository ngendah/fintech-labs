from enum import Enum

from llm.providers.provider import Provider
from llm.providers.vendor.gemini_provider import GeminiProvider
from llm.providers.vendor.ollama_provider import OllamaProvider


class Providers(Enum):
    OLLAMA: Provider = OllamaProvider
    GEMINI: Provider = GeminiProvider

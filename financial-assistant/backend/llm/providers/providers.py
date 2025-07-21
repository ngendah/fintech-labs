from enum import Enum

from backend.llm.providers.provider import Provider
from backend.llm.providers.vendor.gemini_provider import GeminiProvider
from backend.llm.providers.vendor.ollama_provider import OllamaProvider


class Providers(Enum):
    OLLAMA: Provider = OllamaProvider
    GEMINI: Provider = GeminiProvider

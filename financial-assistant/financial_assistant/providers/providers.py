from enum import Enum

from .vendor.ollama_provider import OllamaProvider
from .vendor.provider import Provider  # noqa
from .vendor.gemini_provider import GeminiProvider


class Providers(Enum):
    OLLAMA: Provider = OllamaProvider
    GEMINI: Provider = GeminiProvider

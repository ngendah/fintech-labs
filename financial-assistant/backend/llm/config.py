from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMConfig(BaseSettings):
    NAME: str = "OLLAMA"
    MODEL_NAME: str = "qwen2.5:3b"
    EMBED_MODEL: str = "qwen2.5:3b"
    TIMEOUT: int = 300
    API_KEY: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_file=(".env",),
    )

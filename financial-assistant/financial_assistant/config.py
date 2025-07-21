from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMConfig(BaseSettings):
    name: str ="OLLAMA"
    model: str = "qwen2.5:3b"
    embed: str="qwen2.5:3b"
    timeout: int = 300
    api_key: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_file=(
            ".env",
        ),
    )


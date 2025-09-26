from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings


class AppSettings(BaseSettings):
    db_dsn: str = Field("sqlite3://", validation_alias=AliasChoices("db_dsn", "db_url"))


app_settings = AppSettings()

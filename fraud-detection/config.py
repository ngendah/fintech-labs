import os

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    temp_dir: str = Field(default_fn=os.temp_dir)
    db_uri: str = Field(default="sqlite3://test.db")
    model_dir: str = Field(default_fn=os.temp_dir)

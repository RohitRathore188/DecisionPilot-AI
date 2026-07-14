import os
from typing import List, Union
from pydantic import AnyHttpUrl, BeforeValidator, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated

def parse_cors(v: Union[str, List[str]]) -> List[str]:
  if isinstance(v, str) and not v.startswith("["):
    return [i.strip() for i in v.split(",")]
  elif isinstance(v, (list, str)):
    return v
  raise ValueError(v)

class Settings(BaseSettings):
  model_config = SettingsConfigDict(
    env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
    env_ignore_empty=True,
    extra="ignore"
  )

  API_V1_STR: str = "/api/v1"
  PROJECT_NAME: str = "DecisionPilot AI"

  # CORS configuration
  BACKEND_CORS_ORIGINS: Annotated[
    Union[List[str], str], BeforeValidator(parse_cors)
  ] = Field(default=["http://localhost:5173", "http://127.0.0.1:5173"])

  # Supabase variables
  SUPABASE_URL: str = ""
  SUPABASE_KEY: str = ""
  SUPABASE_JWT_SECRET: str = ""

  # Gemini API Key
  GEMINI_API_KEY: str = ""

  @property
  def has_supabase(self) -> bool:
    return bool(self.SUPABASE_URL and self.SUPABASE_KEY)

settings = Settings()

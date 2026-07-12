"""
Application configuration using pydantic-settings.
All environment variables are validated and typed.
"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "mathematics_geek"

    # Auth
    JWT_SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    # CORS
    CORS_ORIGINS: str = "*"

    # WhatsApp
    WHATSAPP_VERIFY_TOKEN: str = "mathgeek_verify_token"
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""

    # Site
    SITE_URL: str = "https://mathematicsgeek.com"
    SITE_NAME: str = "Mathematics Geek Merit Score Expert"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

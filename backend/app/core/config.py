from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "Crm-Mercadeo LIGA - API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    ORACLE_USER: str
    ORACLE_PASSWORD: str
    ORACLE_HOST: str
    ORACLE_PORT: int = 1521
    ORACLE_SERVICE_NAME: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"oracle+oracledb://{self.ORACLE_USER}:{self.ORACLE_PASSWORD}"
            f"@{self.ORACLE_HOST}:{self.ORACLE_PORT}/?service_name={self.ORACLE_SERVICE_NAME}"
        )


settings = Settings()
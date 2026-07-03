from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


class TokenPayload(BaseModel):
    sub: str
    rol: str | None = None


def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    """Decodifica el JWT del request. No consulta el módulo `usuarios` porque
    aún no existe; cuando exista, reemplazar por una búsqueda real del usuario."""
    try:
        payload = decode_access_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    return TokenPayload(**payload)

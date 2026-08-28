from pydantic import BaseModel, EmailStr


class CorreoBienvenida(BaseModel):
    NOMBRE: str
    CORREO: EmailStr


class CorreoRegistro(BaseModel):
    NOMBRE: str
    CORREO: EmailStr


class CorreoEnviadoResultado(BaseModel):
    enviado: bool = True

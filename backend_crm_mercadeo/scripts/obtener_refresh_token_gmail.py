"""Obtiene el refresh token de Gmail para el backend.

Este script se ejecuta UNA SOLA VEZ desde la maquina local.

Requisitos:
- Tener el venv activado.
- Tener en backend_crm_mercadeo/.env:
    GMAIL_OAUTH_CLIENT_ID
    GMAIL_OAUTH_CLIENT_SECRET

Uso:
    python scripts/obtener_refresh_token_gmail.py
"""

import sys
from pathlib import Path

# Permite importar "app" desde la raiz del backend.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from google_auth_oauthlib.flow import InstalledAppFlow

from app.core.config import settings


# Permiso necesario para enviar correos mediante Gmail API.
SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]

# Google redirigira el navegador nuevamente a este servidor local.
REDIRECT_URI = "http://localhost:8080/"


def main() -> None:
    # ============================================================
    # 1. Validar configuracion
    # ============================================================

    if not settings.gmail_oauth_client_id:
        print("ERROR: Falta GMAIL_OAUTH_CLIENT_ID en el archivo .env")
        sys.exit(1)

    if not settings.gmail_oauth_client_secret:
        print("ERROR: Falta GMAIL_OAUTH_CLIENT_SECRET en el archivo .env")
        sys.exit(1)

    # ============================================================
    # 2. Configuracion OAuth de Google
    # ============================================================

    client_config = {
        "web": {
            "client_id": settings.gmail_oauth_client_id,
            "client_secret": settings.gmail_oauth_client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [
                REDIRECT_URI
            ],
        }
    }

    # ============================================================
    # 3. Crear flujo OAuth
    # ============================================================

    flow = InstalledAppFlow.from_client_config(
        client_config,
        scopes=SCOPES,
    )

    # ============================================================
    # 4. Abrir navegador y solicitar autorizacion
    # ============================================================
    #
    # access_type="offline":
    #     Permite obtener un refresh_token para que el backend
    #     pueda enviar correos posteriormente sin que el usuario
    #     tenga que iniciar sesion cada vez.
    #
    # prompt="consent":
    #     Fuerza la pantalla de consentimiento de Google y ayuda
    #     a obtener un refresh_token nuevo.
    #
    # ============================================================

    print()
    print("=" * 70)
    print("AUTORIZACION DE GMAIL")
    print("=" * 70)
    print()
    print("Se abrira el navegador.")
    print()
    print("Inicia sesion con la cuenta de Gmail que utilizara el CRM")
    print("para enviar los correos.")
    print()
    print("Despues acepta los permisos solicitados por Google.")
    print()
    print("=" * 70)
    print()

    try:
        credentials = flow.run_local_server(
            host="localhost",
            port=8080,
            access_type="offline",
            prompt="consent",
        )
    except Exception as e:
        print()
        print("=" * 70)
        print("ERROR DURANTE LA AUTORIZACION")
        print("=" * 70)
        print()
        print(str(e))
        print()
        sys.exit(1)

    # ============================================================
    # 5. Mostrar refresh token
    # ============================================================

    if not credentials.refresh_token:
        print()
        print("=" * 70)
        print("ERROR: GOOGLE NO DEVOLVIO UN REFRESH TOKEN")
        print("=" * 70)
        print()
        print("Verifica que:")
        print("- Utilizaste prompt='consent'.")
        print("- Utilizaste access_type='offline'.")
        print("- Autorizaste correctamente la aplicacion.")
        print()
        sys.exit(1)

    print()
    print("=" * 70)
    print("AUTORIZACION COMPLETADA CORRECTAMENTE")
    print("=" * 70)
    print()
    print("Copia la siguiente linea en tu archivo .env:")
    print()
    print(f"GMAIL_OAUTH_REFRESH_TOKEN={credentials.refresh_token}")
    print()
    print("=" * 70)
  


if __name__ == "__main__":
    main()

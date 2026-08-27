"""Prueba rapida de app/core/email.py: manda la plantilla de bienvenida a la
direccion que le des, con datos de ejemplo. Corre esto parado en
backend_crm_mercadeo/, con el venv activado:

    python scripts/probar_envio_correo.py destino@correo.com
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.email import enviar_correo_plantilla

# Nombre exacto del archivo en app/templates/emails/.
PLANTILLA = "Bienvenida (1).html"

# "lista" ya viene armada como HTML (el <ul> de la plantilla la envuelve): son los
# <li> de los beneficiarios, no una lista de Python.
BENEFICIARIOS_PRUEBA = ["Juan Perez", "Maria Gomez"]


async def main() -> None:
    if len(sys.argv) < 2:
        print("Uso: python scripts/probar_envio_correo.py destino@correo.com")
        sys.exit(1)

    destino = sys.argv[1]
    lista_html = "".join(f'<li style="margin: 0 0 8px 0;">{nombre}</li>' for nombre in BENEFICIARIOS_PRUEBA)

    await enviar_correo_plantilla(
        destinatarios=[destino],
        asunto="Bienvenido(a) a la membresía Plan Liga (prueba)",
        plantilla=PLANTILLA,
        variables={"lista": lista_html},
    )
    print(f"Listo: plantilla '{PLANTILLA}' enviada a {destino}")


if __name__ == "__main__":
    asyncio.run(main())

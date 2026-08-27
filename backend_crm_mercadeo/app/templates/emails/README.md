# Plantillas de correo

Poner aquí los `.html` que use `enviar_correo_plantilla()` (`app/core/email.py`).
Son plantillas Jinja2: las variables se escriben `{{ nombre }}`, `{{ empresa }}`, etc.,
y se les pasa el valor real al llamar la función (`variables={"nombre": "...", ...}`).

Ejemplo de uso:

```python
from app.core.email import enviar_correo_plantilla

await enviar_correo_plantilla(
    destinatarios=["persona@correo.com"],
    asunto="Bienvenido",
    plantilla="campana_base.html",   # archivo en esta misma carpeta
    variables={"nombre": "Juan", "empresa": "LaLiga"},
)
```

# CRM Liga - Backend

Esqueleto inicial siguiendo la arquitectura **Modular Layered + Repository + Service Layer** definida para el proyecto.

## Estado actual

Implementado:

- `app/core/` — configuración, base de datos, seguridad (JWT/hashing), dependencias, middleware, logging y manejo de excepciones.
- `app/shared/` — base declarativa, sesión de DB, repositorio genérico, paginación, respuestas estándar, validadores, utilidades y enums comunes.
- `app/modules/contactos/` — módulo de referencia completo (router, service, repository, models, schemas, dependencies, exceptions).

Pendiente (a construir siguiendo `contactos` como plantilla): `auth`, `dashboard`, `empresas`, `proveedores`, `servicios`, `oportunidades`, `embudos`, `segmentacion`, `relacionamiento`, `campañas`, `importaciones`, `plan_liga`, `usuarios`, `configuracion`, además de `alembic/` y `tests/`.

## Puesta en marcha

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate      # Windows
pip install -r requirements.txt
cp .env.example .env        # y completar credenciales de Oracle / JWT
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`, con `/health` como endpoint de verificación y `/docs` para la documentación interactiva.

## Convención de módulos

Cada módulo nuevo debe replicar exactamente la estructura de `contactos/`:

```
modules/<nombre>/
├── router.py        # endpoints HTTP, sin lógica de negocio
├── service.py        # lógica de negocio
├── repository.py      # acceso a datos (extiende BaseRepository)
├── models.py          # modelos SQLAlchemy
├── schemas.py          # esquemas Pydantic (Create/Update/Response)
├── dependencies.py    # inyección de dependencias del módulo
└── exceptions.py       # excepciones específicas (heredan de app.shared.exceptions.base)
```

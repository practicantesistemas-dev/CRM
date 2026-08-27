# Cómo se relacionan las tablas del Login

Todas las tablas viven en el esquema Oracle `BDLIGA` y se consultan desde
[`app/queries/user_queries.py`](../app/queries/user_queries.py). El punto de
partida es siempre `INTRANET_USUARIOS`; el resto de tablas se van uniendo
(LEFT JOIN) a partir del usuario para completar sus datos.

## Diagrama

```mermaid
erDiagram
    INTRANET_USUARIOS ||--o{ INTRANET_APP_PERMISOS : "USUARIO = PERMUSU"
    INTRANET_APLICACIONES_USUARIOS ||--o{ INTRANET_APP_PERMISOS : "APUSID = PERMAPP"
    INTRANET_DEPARTAMENTOS ||--o{ INTRANET_USUARIOS : "DEPID = ID_AREA"
    INTRANET_USUARIOS ||--o| INTRANET_COLABORADORES : "NUM_ID = COLNID"
    INTRANET_USUARIOS ||--o| INTRANET_REPORT_USUARIOS : "NUM_ID = IDNUM"
    INTRANET_USUARIOS ||--o{ INTRANET_USUARIO_ROL_APP : "ID = USUARIO_ID"
    INTRANET_ROLES_APP ||--o{ INTRANET_USUARIO_ROL_APP : "ID = ROL_ID"
    INTRANET_ROLES_APP ||--o{ INTRANET_ROLES_PERMISOS_APP : "ID = ROL_ID"
    INTRANET_PERMISOS_APP ||--o{ INTRANET_ROLES_PERMISOS_APP : "ID = PERMISO_ID"

    INTRANET_USUARIOS {
        number ID PK
        varchar USUARIO
        varchar CONTRASENA
        number NUM_ID
        number ID_AREA FK
        varchar PORTAL_ROL
        varchar ESTADO
        varchar NOMBRES
    }

    INTRANET_ROLES_APP {
        number ID PK
        varchar NOMBRE
        varchar SISTEMA "app dueña del rol, ej. 'CRM_MERCADEO'"
        timestamp FECHA_CREADO
        timestamp FECHA_ACTUALIZADO
    }

    INTRANET_PERMISOS_APP {
        number ID PK
        varchar SISTEMA "app dueña del permiso"
        varchar MODULO "ej. 'contactos', 'configuracion'"
        varchar ACCION "ej. 'ver', 'gestionar', 'eliminar'"
        timestamp FECHA_CREADO
        timestamp FECHA_ACTUALIZADO
    }

    INTRANET_ROLES_PERMISOS_APP {
        number PERMISO_ID FK
        number ROL_ID FK
    }

    INTRANET_USUARIO_ROL_APP {
        number USUARIO_ID FK
        number ROL_ID FK
        varchar SISTEMA "app en la que aplica esta asignación"
        timestamp FECHA_CREADO
        timestamp FECHA_ACTUALIZADO
    }

    INTRANET_DEPARTAMENTOS {
        number DEPID PK
        varchar DEPDES
    }

    INTRANET_COLABORADORES {
        varchar COLNID "= NUM_ID (texto)"
        varchar COLEMAILL "email laboral"
        varchar COLEMAILP "email personal"
        varchar COLTID
    }

    INTRANET_REPORT_USUARIOS {
        varchar IDNUM "= NUM_ID (texto)"
        varchar USUARIO
        varchar CONTRASENA
        varchar AREA
    }

    INTRANET_APP_PERMISOS {
        varchar PERMUSU FK "= USUARIO"
        number PERMAPP FK "= APUSID"
    }

    INTRANET_APLICACIONES_USUARIOS {
        number APUSID PK
        varchar APUSNO "nombre app"
        varchar APUSLI "url app"
        varchar PORTAL_ESTADO "activa/inactiva"
    }
```

## Qué hace cada tabla


| Tabla                            | Qué guarda                                                                                                         | Se une por                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `INTRANET_USUARIOS`              | Tabla central de login: usuario, contraseña, área,`PORTAL_ROL`, estado                                            | punto de partida de todo lo demás                    |
| `INTRANET_DEPARTAMENTOS`         | Nombre legible del área (`DEPDES`)                                                                                 | `ID_AREA = DEPID`                                     |
| `INTRANET_COLABORADORES`         | Correos laboral/personal, tipo de colaborador                                                                       | `NUM_ID` (texto) `= COLNID` — opcional (`LEFT JOIN`) |
| `INTRANET_REPORT_USUARIOS`       | Credenciales de un sistema de reportes aparte                                                                       | `NUM_ID` (texto) `= IDNUM` — opcional (`LEFT JOIN`)  |
| `INTRANET_APP_PERMISOS`          | Puente usuario ↔ aplicación:**si** puede entrar (sí/no), no **qué** puede hacer                                 | `PERMUSU = USUARIO`, `PERMAPP = APUSID`               |
| `INTRANET_APLICACIONES_USUARIOS` | Catálogo de apps del portal (nombre, URL, activa/inactiva)                                                         | `APUSID`                                              |
| `INTRANET_ROLES_APP`             | Catálogo de roles (ej. "Admin", "Jefe").`SISTEMA` = app dueña del rol — una sola tabla sirve para todas las apps | filtra por`SISTEMA`                                   |
| `INTRANET_PERMISOS_APP`          | Catálogo de permisos granulares por`MODULO` + `ACCION` (ej. `contactos` / `gestionar`)                             | filtra por`SISTEMA`                                   |
| `INTRANET_ROLES_PERMISOS_APP`    | Puente rol ↔ permiso (muchos a muchos)                                                                             | `ROL_ID`, `PERMISO_ID`                                |
| `INTRANET_USUARIO_ROL_APP`       | Puente usuario ↔ rol. Un usuario puede tener roles distintos en distintos sistemas                                 | `USUARIO_ID`, `ROL_ID`, `SISTEMA`                     |

**`PORTAL_ROL` vs. este esquema nuevo:** `PORTAL_ROL` es un único rol global
de texto libre en `INTRANET_USUARIOS`, sin granularidad — se mantiene por
compatibilidad pero no se relaciona con las 4 tablas de roles/permisos.
Esas 4 tablas son las que controlan qué botones/menús/endpoints ve cada
usuario dentro de cada sistema al que ya tiene acceso.

`INTRANET_USUARIO_ROL_APP.SISTEMA` está desnormalizado a propósito (se
repite el mismo dato que ya está en `INTRANET_ROLES_APP.SISTEMA`) para que
cualquiera de las dos tablas diga a qué sistema pertenece sin necesidad de
un JOIN extra. Al asignar un rol a un usuario, ese `SISTEMA` se copia del
rol elegido.

## Flujo de login

```mermaid
flowchart LR
    A[POST /auth/login] --> B{Usuario y<br/>contraseña OK?}
    B -- no --> X[401 Credenciales inválidas]
    B -- si --> C{Usuario activo?}
    C -- no --> Y[403 Usuario inactivo]
    C -- si --> D[Completa datos con<br/>LEFT JOIN: departamento,<br/>colaborador, reportes]
    D --> E[Genera JWT: sub, role]
    E --> F[Consulta permisos<br/>ver diagrama abajo]
    F --> G[Responde: token + permisos]
```

`APPS_BY_USER_QUERY` (fuera de este backend, en el portal) usa
`INTRANET_APP_PERMISOS` para decidir qué aplicaciones activas ve el usuario
en el menú del Intranet — es un paso previo y separado del login de cada
app individual.

## Resolución de permisos (ejemplo: CRM_MERCADEO)

Implementado en
[`AuthRepository.obtener_permisos`](../app/modules/auth/repository.py).
Dos `MODULO` funcionan como comodín dentro del catálogo de permisos y nunca
se devuelven tal cual — solo disparan una expansión:

```mermaid
flowchart TD
    S[Roles del usuario en<br/>INTRANET_USUARIO_ROL_APP] --> P[Permisos crudos de<br/>esos roles]
    P --> T{"¿Tiene el<br/>permiso 'todo'?"}
    T -- si --> R1["Todos los permisos del sistema<br/>(incluye configuracion)"]
    T -- no --> L{"¿Tiene el<br/>permiso 'logica'?"}
    L -- si --> R2["Todos los permisos del sistema<br/>EXCEPTO configuracion"]
    L -- no --> R3["Solo los permisos que el<br/>rol tiene asignados explícitamente"]
```

Ver [`CONSULTAS_EJEMPLO_PERquiMISOS_APP.md`](CONSULTAS_EJEMPLO_PERMISOS_APP.md)
para las consultas SQL de referencia de este mismo flujo.

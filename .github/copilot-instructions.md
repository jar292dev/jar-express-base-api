# Contexto del proyecto

API REST base con Node.js + Express + TypeScript + Prisma + MySQL.

## Arquitectura

- Arquitectura en capas: Controller → Service → Repository
- Cada módulo en src/modules/{nombre}/ con sus propios controller, service, repository, schema, routes y docs
- Repositorio base genérico en src/shared/repositories/base.repository.ts
- Service base con auditoría: src/shared/services/base.service.ts
- DI manual via src/shared/container.ts
- Contexto de request via src/shared/middlewares/request-context.middleware.ts

## Convenciones de código

- Ficheros: kebab-case → notices.controller.ts
- Clases: PascalCase → NoticesController
- Métodos y variables: camelCase → findNoticeById
- Constantes: UPPER_SNAKE_CASE → HTTP_STATUS
- Tablas BD: snake_case → audit_logs
- Campos BD: snake_case → created_at
- Campos Prisma/TS: camelCase → createdAt (con @map)
- DTOs: sufijo DTO → CreateNoticeDTO
- Schemas Zod: sufijo Schema → noticeCreateSchema
- Tests: mismo nombre que el fichero + .test → notices.service.test.ts

## Base de datos

- ORM: Prisma 5 con MySQL
- Cliente generado en src/generated/prisma (no editar)
- Campos en camelCase en Prisma, snake_case en BD via @map
- UUIDs como CHAR(36)
- Campos de auditoría en todas las entidades: createdAt, updatedAt, version, createdBy, updatedBy

## Formato de respuesta API

- Éxito single: { data: {...} }
- Éxito paginado: { data: [...], meta: { total, page, limit, pages } }
- Error: { error: { code, message, details } }
- Códigos HTTP: usar siempre las constantes de http.constants.ts

## Errores

- Usar siempre errores de dominio tipados: NotFoundError, ConflictError, BadRequestError
- Nunca lanzar Error genérico desde service o repository
- Controllers siempre con try/catch delegando a next(err)
- El middleware global error.middleware.ts transforma los errores en respuestas HTTP:
  { error: { code: "NOT_FOUND", message: "...", details: {} } }

## Crear módulo nuevo

1. Crear carpeta src/modules/{nombre}/
2. {nombre}.schema.ts — schemas Zod: createSchema, updateSchema, filterSchema
3. {nombre}.repository.ts — extiende BaseRepository, define delegate
4. {nombre}.service.ts — extiende BaseService, lógica de negocio específica
5. {nombre}.controller.ts — métodos Express, siempre try/catch + next(err)
6. {nombre}.routes.ts — router con validateBody/validateQuery/validateParams
7. {nombre}.docs.ts — registro OpenAPI, se autodescubre via glob
8. Registrar repositorio y service en shared/container.ts
9. Registrar router en src/router.ts
10. Añadir modelo en prisma/schema.prisma + npx prisma generate + npm run schema:export
    → npx prisma generate
    → npm run schema:export ← regenera docs/schema.sql

## Auditoría

- Todas las operaciones de escritura pasan por BaseService, que registra en audit_logs
- El contexto del actor se obtiene de req.context.actorId (null hasta que haya auth)
- Nunca escribir en audit_logs directamente desde controllers o repositories
- Los services reciben RequestContext como último parámetro en create/update/delete

## Tests

- Vitest + Supertest
- Tres niveles: unit (service), integration (repository), e2e (rutas)
- Tests en src/modules/{nombre}/tests/

## Convenciones de tests

- Unit: mockear repositorio con vi.fn(), limpiar con vi.clearAllMocks() en beforeEach
- Integration: usar BD real, crear datos en beforeAll, limpiar en afterAll
- E2E: peticiones HTTP completas con supertest, limpiar datos creados en afterAll
- Nunca mockear prisma directamente, mockear el repositorio completo

## Lo que NO hacer

- No usar any salvo casos justificados con comentario eslint-disable
- No saltarse la capa de validación Zod en controllers
- No acceder a prisma directamente desde controllers o services, solo desde repositories
- No hardcodear strings, usar constants/
- Modificar ficheros en src/generated/ (generado por Prisma)
- Instalar dependencias nuevas sin justificarlo
- Crear ficheros fuera de la estructura definida

## Dependencias aprobadas

- Validación: zod (no joi, no yup)
- ORM: prisma (no typeorm, no sequelize)
- Tests: vitest + supertest (no jest)
- HTTP: express 5 (no fastify, no koa)
- Documentación: @asteasolutions/zod-to-openapi + swagger-ui-express
- UUID: uuid (no nanoid, no cuid)
- Logs: morgan (no winston por ahora)

Para añadir una dependencia nueva, justificar por qué no sirve ninguna de las existentes.

## Documentación de referencia

Antes de generar cualquier código, consulta estos ficheros:

- `README.md` — arquitectura, estructura de carpetas, convenciones y decisiones de diseño
- `docs/schema.sql` — esquema completo de la base de datos con todos los tipos, índices y constraints

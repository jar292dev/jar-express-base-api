---
applyTo: '**/*.test.ts,**/*.e2e.test.ts'
---

# Convenciones de tests

- Usar Vitest + Supertest
- Tres niveles: unit, integration, e2e
- Los mocks del repositorio siempre con vi.fn()
- Limpiar mocks en beforeEach con vi.clearAllMocks()
- Los tests e2e limpian sus datos en afterAll

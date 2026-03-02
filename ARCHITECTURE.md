# Architecture Documentation

## Overview

This system uses a **Backend-for-Frontend (BFF)** architecture. A lightweight Express.js server handles SQLite database access and serves the built React application. This allows us to use SQLite (file-based, zero-config) while keeping it accessible from a browser-based React app.

```
Browser (React) ←→ Express BFF Server ←→ SQLite Database
```

## Design Decisions

### 1. Atomic Design Pattern
**Decision:** Strict 4-layer atomic structure (atoms → molecules → organisms → templates → pages).

**Rationale:** Assignment explicitly required "atomic design principles." Benefits:
- Clear import rules prevent circular dependencies
- Components are independently testable
- Facilitates reuse across pages

**Trade-off:** More boilerplate for simple features; justified by long-term maintainability.

### 2. SQLite over PostgreSQL
**Decision:** SQLite via `better-sqlite3` + Express BFF.

**Rationale:** Zero-config setup, works in Docker with a single volume mount, meets assignment requirements. SQLite handles up to 10,000+ records well for this use case.

**Trade-off:** Not horizontally scalable (no multiple server instances). For production scale, swap the `server/db/` layer for PostgreSQL without touching client-side code (repository pattern enables this).

### 3. Redux Toolkit for State Management
**Decision:** Redux Toolkit for server state + local `useState` for UI state.

**Rationale:** Assignment mentioned Redux Toolkit explicitly. Provides predictable state, DevTools support, and structured async patterns via `createAsyncThunk`.

**Trade-off:** More boilerplate than Zustand or React Query. Justified by the assignment requirements and team familiarity expectations.

### 4. Repository Pattern (Server-side)
All SQLite queries are isolated in `server/db/queries/`. Routes only call repository functions, never raw SQL.

**Benefit:** Swappable database backend without touching route logic.

### 5. API Response Envelope
All API endpoints return `{ data, success, error }`. Client-side API functions always handle both success and failure, never throwing to components.

## Scalability Considerations

| Concern | Current Solution | Production Scale |
|---|---|---|
| Large datasets | TanStack Virtual (10k+ records) | Server-side pagination |
| Concurrent users | SQLite WAL mode | PostgreSQL + connection pool |
| State sync | Redux polling (if needed) | WebSocket / SSE |
| Performance | Memoized selectors | Redis caching layer |

## Component Dependency Rules

```
pages → templates → organisms → molecules → atoms
pages → organisms (direct, for complex pages)
pages → hooks → api → (server)
```

No layer may import from a layer above it.

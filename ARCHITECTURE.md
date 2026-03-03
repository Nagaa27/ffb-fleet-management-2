# Architecture Documentation

## Overview

This system uses a **Backend-for-Frontend (BFF)** architecture. A lightweight Express.js server handles SQLite database access and serves the built React application. This allows us to use SQLite (file-based, zero-config) while keeping it accessible from a browser-based React app.

```
Browser (React) ←→ Express BFF Server ←→ SQLite Database
```

## Design Decisions

### 1. Atomic Design Pattern
**Decision:** Strict 5-layer atomic structure (atoms → molecules → organisms → templates → pages).

**Rationale:** Assignment explicitly required "atomic design principles." Benefits:
- Clear import rules prevent circular dependencies
- Components are independently testable
- Facilitates reuse across pages

**Component Inventory:**
| Layer | Components |
|---|---|
| **Atoms** | Button, Input, Select, Badge, Card, Skeleton, Spinner |
| **Molecules** | FormField, SearchInput, StatCard, StatusBadge, EmptyState, ConfirmDialog, ErrorBoundary, TableSkeleton, DashboardSkeleton |
| **Organisms** | DataTable (virtual), TripForm (multi-mill), TripList (status actions), CollectionForm, VehicleList, DriverList, MillList, Sidebar |
| **Templates** | DashboardLayout (responsive sidebar), PageLayout |
| **Pages** | DashboardPage (charts), TripsPage (CRUD + collection), VehiclesPage, DriversPage, MillsPage |

**Trade-off:** More boilerplate for simple features; justified by long-term maintainability.

### 2. SQLite over PostgreSQL
**Decision:** SQLite via `better-sqlite3` + Express BFF.

**Rationale:** Zero-config setup, works in Docker with a single volume mount, meets assignment requirements. SQLite handles up to 10,000+ records well for this use case.

**Trade-off:** Not horizontally scalable (no multiple server instances). For production scale, swap the `server/db/` layer for PostgreSQL without touching client-side code (repository pattern enables this).

### 3. Redux Toolkit for State Management
**Decision:** Redux Toolkit for server state + local `useState` for UI state.

**Rationale:** Assignment mentioned Redux Toolkit explicitly. Provides predictable state, DevTools support, and structured async patterns via `createAsyncThunk`.

**Async Thunks:** `fetchTripsThunk`, `createTripThunk`, `updateTripStatusThunk`, `recordCollectionThunk`, and equivalents for vehicles, drivers, mills, dashboard.

**Trade-off:** More boilerplate than Zustand or React Query. Justified by the assignment requirements and team familiarity expectations.

### 4. Repository Pattern (Server-side)
All SQLite queries are isolated in `server/db/queries/`. Routes only call repository functions, never raw SQL.

**Benefit:** Swappable database backend without touching route logic.

### 5. API Response Envelope
All API endpoints return `{ data, success, error }`. Client-side API functions always handle both success and failure, never throwing to components.

### 6. Error Handling & Loading States
**ErrorBoundary** wraps the entire app, catching unhandled React errors with retry/reload actions. **Skeleton screens** (TableSkeleton, DashboardSkeleton) provide perceived-performance loading states instead of plain spinners.

### 7. Responsive Design
Mobile-first CSS Modules with breakpoints at `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`. Sidebar collapses to hamburger menu on mobile with overlay behavior.

### 8. Virtualization & Charts
**@tanstack/react-virtual:** DataTable auto-enables row virtualization when datasets exceed 100 rows, ensuring smooth rendering of 10,000+ records.

**recharts:** Dashboard displays PieChart (vehicle status distribution) and BarChart (trip status breakdown) for at-a-glance operational insight.

## Feature: Multi-Mill Trip Planning
Trips support multiple mill destinations via a checkbox selection in TripForm. Planned weight is evenly distributed across selected mills. The Collection feature (CollectionForm) allows recording actual weights per-mill for in-progress trips.

## Scalability Considerations

| Concern | Current Solution | Production Scale |
|---|---|---|
| Large datasets | TanStack Virtual (10k+ records) | Server-side pagination |
| Concurrent users | SQLite WAL mode | PostgreSQL + connection pool |
| State sync | Redux polling (if needed) | WebSocket / SSE |
| Performance | Memoized selectors + virtualization | Redis caching layer |
| Error resilience | ErrorBoundary + graceful fallbacks | Sentry + error tracking |

## Component Dependency Rules

```
pages → templates → organisms → molecules → atoms
pages → organisms (direct, for complex pages)
pages → hooks → api → (server)
store → api (thunks call API functions)
```

No layer may import from a layer above it.

## Business Logic (Utils)

`src/utils/capacityCalculator.ts` encapsulates fleet-specific calculations:
- `calculateTripsNeeded(totalWeight, vehicleCapacity)` — compute trips to transport a given weight
- `calculateLoadPercentage(load, capacity)` — percentage utilization
- `isOverCapacityWarning(load, capacity)` — boolean safety check
- `calculateDriversNeeded(tripCount, maxTripsPerDriver)` — staffing estimate
- `calculateFleetUtilization(activeVehicles, totalVehicles)` — fleet usage metric

# Testing Strategy

## Philosophy
Test the **behavior**, not the implementation. Tests should break when behavior changes, not when we refactor internals.

## Current Test Stats
| Metric | Count |
|---|---|
| **Test Files** | 26 |
| **Total Tests** | 146+ |
| **All Passing** | ✅ Yes |

## Test Categories Breakdown

| Category | Files | Tests | Description |
|---|---|---|---|
| **Unit — Atoms** | 4 | ~10 | Button, Badge, Card, Spinner rendering |
| **Unit — Molecules** | 6 | ~18 | FormField, SearchInput, StatCard, EmptyState, ErrorBoundary, TableSkeleton |
| **Unit — Organisms** | 4 | ~12 | TripList, VehicleList, DriverList, MillList rendering + behavior |
| **Unit — Utils** | 1 | 24 | capacityCalculator: all 5 functions, edge cases, boundary values |
| **Unit — Store (Slices)** | 5 | ~40 | tripsSlice, millsSlice, vehiclesSlice, driversSlice, dashboardSlice thunks + reducers |
| **Unit — API** | 3 | ~22 | tripApi, millApi, vehicleApi fetch mocking |
| **Integration** | 1 | 4 | Trip creation flow: form render → vehicle/driver/mill select → submit → Redux state update |
| **Performance** | 1 | 4 | Large dataset rendering (1000 rows), mounting speed, skeleton loading, sort performance |

## Coverage Targets
| Area | Target |
|---|---|
| `src/utils/` | 90%+ |
| `src/store/` | 85%+ |
| `src/api/` | 80%+ |
| `src/atoms/` + `src/molecules/` | 80%+ |
| `src/organisms/` | 75%+ |
| **Overall** | **80%+** |

## Test Types

### 1. Unit Tests — Utils
Focus: Pure functions with no side effects. Easiest to test, highest coverage priority.
```bash
src/utils/__tests__/capacityCalculator.test.ts  # 24 tests
```

Key scenarios for `capacityCalculator`:
- `calculateTripsNeeded(240, 12)` → `20`
- `calculateLoadPercentage(10, 12)` → `83.33`
- `isOverCapacityWarning(13, 12)` → `true`
- Edge cases: zero capacity, zero values, exact boundaries

### 2. Unit Tests — Components
Focus: Render correctly, show correct states, handle edge cases.
```typescript
// Pattern:
it('should [behavior] when [condition]', () => {
  render(<Component prop="value" />);
  expect(screen.getByTestId('x')).toHaveText('...');
});
```

### 3. Unit Tests — Redux Slices
Focus: Thunk lifecycle (pending/fulfilled/rejected), state transitions, selectors.
```bash
src/store/__tests__/tripsSlice.test.ts    # 8 tests
src/store/__tests__/millsSlice.test.ts    # 6 tests
src/store/__tests__/vehiclesSlice.test.ts
src/store/__tests__/driversSlice.test.ts
src/store/__tests__/dashboardSlice.test.ts
```

### 4. Unit Tests — API Layer
Focus: Correct URL construction, fetch options, error handling.
```bash
src/api/__tests__/tripApi.test.ts    # 8 tests
src/api/__tests__/millApi.test.ts    # 6 tests
src/api/__tests__/vehicleApi.test.ts
```

### 5. Integration Tests — Trip Creation Flow
The most critical integration test. Tests the full user flow with real Redux store:
1. Renders trip form within Redux Provider + React Router
2. Verifies vehicle, driver, mill selection
3. Submits form → validates API call payload
4. Handles error scenarios

```bash
src/__tests__/integration/tripCreation.test.tsx  # 4 tests
```

### 6. Performance Tests
Validates rendering speed for large datasets:
```bash
src/__tests__/performance/largeDataset.test.tsx  # 4 tests
```
- Renders 1000 trips within 1 second
- DataTable with 1000 rows mounts quickly
- Skeleton screen renders during loading
- Sort toggling under 500ms

## Run Commands
```bash
npm test                         # All tests
npx vitest run                   # All tests (CI mode)
npx vitest run --coverage        # With coverage report
npx vitest run -t "Trip"         # Filter by test name
npx vitest run src/utils/        # Filter by path
```

## Mock Strategy
- **API calls:** Mock `global.fetch` in unit tests, mock entire API modules for slice/integration tests
- **Redux store:** Use real store with `configureStore()` for integration tests
- **React Router:** Wrap with `MemoryRouter` for components that use routing
- **Date:** Mock `Date.now()` to fixed timestamp for deterministic tests
- **SQLite:** Never hit real DB in tests — API layer is mocked
- **JSDOM Limitations:** Virtual scrolling tests verify container structure rather than exact row counts (JSDOM has no layout engine)

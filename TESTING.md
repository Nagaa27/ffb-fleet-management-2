# Testing Strategy

## Philosophy
Test the **behavior**, not the implementation. Tests should break when behavior changes, not when we refactor internals.

## Coverage Targets
| Area | Target |
|---|---|
| `src/utils/` | 90%+ |
| `src/hooks/` | 85%+ |
| `src/api/` | 80%+ |
| `src/atoms/` + `src/molecules/` | 80%+ |
| `src/organisms/` | 75%+ |
| **Overall** | **80%+** |

## Test Types

### 1. Unit Tests — Utils
Focus: Pure functions with no side effects. Easiest to test, highest coverage priority.
```bash
# Files to test:
src/utils/capacityCalculator.test.ts
src/utils/dateUtils.test.ts
src/utils/validators.test.ts
```

Key scenarios for `capacityCalculator`:
- `calculateTripsNeeded(240, 12)` → `20`
- `calculateLoadPercentage(10, 12)` → `83.3`
- Handles 0 capacity (should not throw)

### 2. Unit Tests — Components
Focus: Render correctly, show correct states, handle edge cases.
```typescript
// Pattern:
it('should [behavior] when [condition]', () => {
  render(<Component prop="value" />);
  expect(screen.getByTestId('x')).toHaveText('...');
});
```

### 3. Integration Tests — Trip Creation Flow
The most critical integration test. Tests the full user flow:
1. Open trip creation form
2. Select vehicle → capacity shown
3. Select driver → availability checked
4. Select mill(s) → planned weight auto-filled
5. Submit → trip appears in list + state updated

```bash
src/__tests__/integration/tripCreation.test.tsx
```

### 4. Performance Tests
```typescript
it('should render 1000 trips within 1 second', () => {
  const trips = generateMockTrips(1000);
  const start = performance.now();
  render(<TripList trips={trips} />);
  const end = performance.now();
  expect(end - start).toBeLessThan(1000);
});
```

## Run Commands
```bash
npm test                         # All tests
npm test -- --coverage           # With coverage
npm test -- --testPathPattern=Trip  # Specific pattern
```

## Mock Strategy
- **API calls:** Mock `global.fetch` in unit tests
- **Redux store:** Use `renderWithProviders()` helper that wraps with real store
- **Date:** Mock `Date.now()` to fixed timestamp for deterministic tests
- **SQLite:** Never hit real DB in tests — API layer is mocked

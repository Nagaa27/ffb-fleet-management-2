# API Documentation

## Base URL
`http://localhost:3000/api`

## Response Format
All endpoints return:
```json
{ "data": <T> | null, "success": true | false, "error": "message" | null }
```

---

## Vehicles `/api/vehicles`

| Method | Path | Description |
|---|---|---|
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle (only if no active trips) |
| PUT | `/api/vehicles/:id/driver` | Assign/unassign driver |

## Drivers `/api/drivers`

| Method | Path | Description |
|---|---|---|
| GET | `/api/drivers` | List all drivers |
| GET | `/api/drivers/available?date=YYYY-MM-DD` | Available drivers on a date |
| GET | `/api/drivers/:id` | Get driver by ID |
| POST | `/api/drivers` | Create driver |
| PUT | `/api/drivers/:id` | Update driver |
| DELETE | `/api/drivers/:id` | Delete driver (only if no active trips) |

## Mills `/api/mills`

| Method | Path | Description |
|---|---|---|
| GET | `/api/mills` | List all mills |
| GET | `/api/mills/:id` | Get mill by ID |
| POST | `/api/mills` | Create mill |
| PUT | `/api/mills/:id` | Update mill |

## Trips `/api/trips`

| Method | Path | Description |
|---|---|---|
| GET | `/api/trips` | List trips (supports filters) |
| GET | `/api/trips?date=YYYY-MM-DD` | Filter by date |
| GET | `/api/trips?status=SCHEDULED` | Filter by status |
| GET | `/api/trips?vehicleId=x` | Filter by vehicle |
| GET | `/api/trips/:id` | Get trip details |
| POST | `/api/trips` | Create new trip |
| PUT | `/api/trips/:id/status` | Update trip status |
| POST | `/api/trips/:id/collections` | Record a collection |

## Dashboard `/api/dashboard`

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/summary?date=YYYY-MM-DD` | Daily dashboard metrics |

### Dashboard Response Shape
```typescript
{
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  maintenanceVehicles: number;
  availableDrivers: number;
  onDutyDrivers: number;
  todayScheduled: number;
  todayInProgress: number;
  todayCompleted: number;
  todayCollectedTons: number;
  todayTargetTons: number;
}
```

# FFB Fleet Management System

> A production-ready logistic management system for Fresh Fruit Bunch (FFB) evacuation operations. Built for the Senior Frontend Engineer take-home assignment.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Docker & Docker Compose (for containerized deployment)

### Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd ffb-fleet-management

# 2. Install dependencies
npm install

# 3. Initialize the database with seed data
npm run db:seed

# 4. Start the development server
npm run dev
```

Visit http://localhost:5173 (Vite dev server)

### Production Build

```bash
npm run build    # Build frontend
npm run preview  # Preview production build at http://localhost:3000
```

### Run Tests

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode during development
```

### Docker Deployment

```bash
# Start the full application stack
docker-compose up

# Start in background
docker-compose up -d

# Stop
docker-compose down
```

Application available at **http://localhost:3000**

---

## 🗂️ Project Structure

```
ffb-fleet-management/
├── src/
│   ├── atoms/          # Base UI components
│   ├── molecules/      # Composed UI components
│   ├── organisms/      # Complex UI sections
│   ├── templates/      # Page layouts
│   ├── pages/          # Route-level pages
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Redux state management
│   ├── api/            # API client layer
│   ├── types/          # TypeScript interfaces
│   └── utils/          # Utility functions
├── server/             # Express.js BFF server
│   ├── routes/         # API route handlers
│   └── db/             # SQLite queries and schema
├── .agent/             # Agent workflows and rules
├── docker-compose.yml
├── Dockerfile
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    └── TESTING.md
```

---

## 🌱 Seed Data

The seed data includes:
- **10 Vehicles** (mix of small/medium/large trucks)
- **10 Drivers** (with various availability statuses)
- **5 Palm Oil Mills** (across different locations in Sumatra)
- **50+ Trips** (spanning 7 days, various statuses)

To reset and re-seed:
```bash
npm run db:reset   # Drop all tables
npm run db:seed    # Re-initialize with seed data
```

---

## 🔑 Key Features

| Feature | Description |
|---|---|
| **Fleet Dashboard** | Real-time overview of all vehicles, drivers, and daily metrics |
| **Trip Management** | Create, schedule, and track FFB evacuation trips |
| **Capacity Planning** | Auto-calculate trips needed based on mill production (240 ton/day @ 12 ton/vehicle) |
| **Conflict Detection** | Prevent double-booking of drivers and vehicles |
| **Responsive Design** | Mobile-first, works on phone, tablet, and desktop |
| **Data Virtualization** | Handles 10,000+ records without performance degradation |

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for detailed testing strategy.

```bash
npm test -- --coverage
# Target: 80%+ overall coverage
```

---

## 🐳 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `DB_PATH` | `./data/database.sqlite` | SQLite file path |
| `NODE_ENV` | `development` | Environment |

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design decisions
- [API.md](./API.md) — Data layer documentation
- [TESTING.md](./TESTING.md) — Testing strategy and coverage

---

## 📋 Business Rules

- Each palm oil mill produces **240 tons/day** (30 ton/hr × 8 hr shift)
- Each vehicle has a capacity of **12 tons**
- Each mill requires a minimum of **20 trips/day** to clear daily production
- A driver cannot have more than one active trip per day
- A vehicle cannot be assigned to overlapping trips

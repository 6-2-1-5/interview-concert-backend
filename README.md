# Concert - Backend

## Architecture Overview

This is a NestJS-based concert booking system that follows a modular architecture with clear separation of concerns. The application is designed to handle concert management, user reservations, and booking history tracking.

### Shared Infrastructure

#### Authentication & Authorization (`src/shared/`)

- **AuthGuard**: Header-based authentication (user-id header)
- **AdminRoleGuard**: Role-based access control for admin operations
- **Decorators**:
  - `@AdminOnly()`: Restricts endpoints to admin users
  - `@UserId()`: Extracts authenticated user ID from requests

#### Data Layer (`src/shared/servers/`)

- **Database Simulation**: JSON file-based storage (`db.ts`)
- **Tables**: users, concerts, reservations, histories
- **Note**: Designed for interview purposes; production would use a real database

### Key Design Patterns

1. **Modular Architecture**: Each domain (concerts, users, reservations, histories) is encapsulated in its own module
2. **Guard-based Security**: Declarative authentication and authorization
3. **Circular Dependency Resolution**: Uses `forwardRef()` for interdependent modules
4. **Entity-Service-Controller Pattern**: Clear separation of data, business logic, and HTTP handling

### API Endpoints Structure

- **Concerts**: `/concerts` - CRUD operations with admin restrictions
- **Users**: `/users` - User management
- **Reservations**: `/reservations/:concertId/reserve|unreserve` - Seat booking operations
- **Histories**: `/histories` - Action audit trails

## Prerequisites

- Node.js 18+
- pnpm package manager

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Compile and run the project

```bash
# development
$ pnpm run start
```

### 3. Service running [http://localhost:8080](http://localhost:8080).

## Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

## Bonus Task (Optional):

- Express your opinion about how to optimize your website in case that this
  website contains intensive data and when more people access, the lower speed
  you get?
  - Caching for server side data fetching eg. React Query
  - Add chunk fetching concerts data eg. Pagination, load on scroll
  - Add Rate limit to prevent spam
  - Use server side render to reduce client side load
  - Add CDN for static assets global
  - Optimize database query and use indexing where appropriate
  - Add load balancer for traffic across multiple server
  - Use database sharding for data across multiple server
  - Use message queue e.g. RabbitMQ, Upstash QStash to handle concurrent
  - Use monitoring tool to track performance and bottleneck

- Express your opinion about how to handle when many users want to reserve the
  ticket at the same time? We want to ensure that in the concerts there is no one
  that needs to stand up during the show.
  - Database level locking
  - Use queue based processing eg. RabbitMQ, Redis
  - Add rate limit to prevent spam

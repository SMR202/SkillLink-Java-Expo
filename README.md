```bash
cd frontend
yarn install
yarn start        # Expo dev server
yarn web          # Open in browser
yarn android      # Run on Android emulator
yarn ios          # Run on iOS simulator
```

By default the frontend connects to `http://localhost:8080/api`. Override this with:

```bash
EXPO_PUBLIC_API_URL=https://your-backend.com/api yarn start
```

---

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | H2 file DB | JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `sa` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | *(empty)* | Database password |
| `APP_JWT_SECRET` | dev key | JWT signing secret (min 256-bit) |
| `SERVER_PORT` | `8080` | Server port |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:8080/api` | Backend base URL |

---

## API Overview

All routes are prefixed with `/api`.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register (CLIENT / PROVIDER / ADMIN) |
| POST | `/auth/login` | Login — returns JWT + refresh token |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset email |
| POST | `/auth/reset-password` | Reset password with token |
| PUT | `/auth/change-password` | Change password (authenticated) |

### Core Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/providers/search` | Search providers with filters |
| GET | `/providers/{id}` | Public provider profile |
| POST | `/bookings` | Create a booking |
| PUT | `/bookings/{id}/action` | Accept or decline a booking |
| GET | `/categories` | List skill categories |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews` | Submit review (booking must be COMPLETED) |
| GET | `/reviews/provider/{providerId}` | Get provider reviews (paginated, public) |
| GET | `/reviews/me` | Provider's received reviews |
| PUT | `/reviews/{id}/respond` | Provider response to a review |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/messages` | Send a message |
| GET | `/messages/{bookingId}` | Get conversation for a booking |

Real-time updates are available via WebSocket at `/ws/**`.

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/checkout` | Process payment (booking must be ACCEPTED) |
| GET | `/payments/history` | Client payment history |
| GET | `/payments/history/provider` | Provider payment history |
| GET | `/payments/earnings` | Provider earnings summary |

### Jobs & Proposals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/job-posts` | Post a job (CLIENT) |
| GET | `/job-posts` | Browse job board |
| POST | `/proposals` | Submit proposal (PROVIDER) |

### Admin *(requires ADMIN role)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users (searchable, filterable) |
| PUT | `/admin/users/{id}/suspend` | Suspend a user |
| PUT | `/admin/users/{id}/activate` | Activate a user |
| GET | `/admin/analytics` | Platform analytics (users, bookings, revenue) |
| GET | `/admin/reviews` | All reviews for moderation |
| DELETE | `/admin/reviews/{id}` | Delete a review |

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Authentication and base user data |
| `provider_profiles` | Provider bio, skills, avatar, aggregated rating |
| `client_profiles` | Client contact info and addresses |
| `bookings` | Service bookings with status lifecycle |
| `reviews` | Post-booking ratings (1–5) and comments |
| `messages` | In-app chat messages per booking |
| `payments` | Payment records with platform fee breakdown |
| `job_posts` | Jobs posted by clients |
| `proposals` | Provider proposals on job posts |
| `skill_categories` | Service categories (Plumbing, Electrical, etc.) |
| `notifications` | User notifications |
| `audit_logs` | Admin action audit trail |

Schema is managed by Flyway migrations in `backend/src/main/resources/db/migration/`.

---

## Roles & Access Control

| Role | Capabilities |
|------|-------------|
| `CLIENT` | Book services, post jobs, pay, submit reviews |
| `PROVIDER` | Accept/decline bookings, submit proposals, respond to reviews, track earnings |
| `ADMIN` | Manage users, view analytics, moderate reviews |

JWTs carry a 24-hour expiry. Refresh tokens are valid for 7 days. Tokens are stored in Expo Secure Store on the device.

---

## Business Rules

- A review can only be submitted when `booking.status == COMPLETED`
- One review per booking (enforced by unique constraint)
- Messages are only allowed on `PENDING` or `ACCEPTED` bookings
- Payment can only be processed when `booking.status == ACCEPTED`
- Booking status flow: `PENDING → ACCEPTED/DECLINED → PAID → COMPLETED`
- All admin actions are logged in `audit_logs`
- Suspended users cannot authenticate

---

## Running Tests

```bash
# Backend unit & integration tests
cd backend
mvn test
```

Test reports are written to `backend/target/surefire-reports/`.

For API testing, import the Postman collection and set `{{base_url}}` to `http://localhost:8080`.

---

## Deployment

The backend supports multiple Spring profiles:

| Profile | Activated by | Database |
|---------|-------------|----------|
| *(default)* | none | H2 file-based |
| `postgres` | `--spring.profiles.active=postgres` | Local PostgreSQL |
| `supabase` | `--spring.profiles.active=supabase` | Supabase cloud |

```bash
# Example: deploy with Supabase
java -jar target/skilllink-backend-1.0.0.jar --spring.profiles.active=supabase
```

CORS is currently open to all origins. Restrict `SecurityConfig.java` before deploying to production.

---

## License

This project was developed as a university project. All rights reserved.
# PokeContest (Contest Nexus) — Implementation Guide & Next Steps

This document outlines the current state of the application and provides a step-by-step guide on what still needs to be implemented to make the application fully functional.

---

## Current State

### Backend (Spring Boot 3.4.5 · Java 21 · SQLite)
- **6 JPA Entities** defined and auto-generated via `ddl-auto=update`: `User`, `Contest`, `PokemonRequest`, `PokemonType`, `Submission`, `Notification`.
- **4 Enums**: `Role` (BOSS/ANALISTA/ARTISTA), `ContestStatus` (ACTIVE/PENDING/COMPLETED), `ContestPriority` (ROUTINE/CRITICAL), `SubmissionStatus` (PENDING/ACCEPTED/DECLINED/REVISION).
- **6 Repositories** (JpaRepository): `UserRepository`, `ContestRepository`, `PokemonRequestRepository`, `PokemonTypeRepository`, `SubmissionRepository`, `NotificationRepository` — with custom query methods.
- **1 Controller**: `HealthController` at `GET /api/health` → returns `{"status": "UP"}`.
- **0 Service classes** — no business logic layer exists.
- **0 DTOs** — no request/response transfer objects.
- **No CORS configuration** — frontend requests will be blocked by browser CORS policy.
- **No data seeding** — database starts empty; no initial Pokémon types, users, or sample data.
- **No Spring Security** — `spring-boot-starter-security` is not in the dependencies.

### Frontend (React 19 · Vite · react-router-dom 7)
- **5 UI Components** built: `Login`, `BossDashboard`, `AnalistaDashboard`, `ArtistaDashboard`, `ContestPage` (with Boss/Artist/Analyst sub-views).
- **API service layer** (`services/api.js`) returns **mock data** with artificial delays. Real `fetch()` calls to the backend are present but **commented out** in every method.
- **Vite proxy** configured to forward `/api` requests to `http://localhost:8080` (ready for when real calls are enabled).
- **Styling** (`index.css`) provides a modern, responsive design with role-specific theming.
- **Routing**: `/` → Login, `/boss` → BossDashboard, `/analista` → AnalistaDashboard, `/artista` → ArtistaDashboard, `/contest/:role` → ContestPage.
- **Sidebar & TopNavbar** are duplicated inline in each dashboard component (not extracted as shared components).

### What Exists vs What Is Missing

| Layer            | What EXISTS                                    | What is MISSING                                              |
|------------------|------------------------------------------------|--------------------------------------------------------------|
| **DB Entities**  | All 6 entities + 4 enums                       | —                                                            |
| **Repositories** | All 6 with custom queries                      | —                                                            |
| **Controllers**  | Only `HealthController`                        | Auth, Contest, Submission, Notification, PokemonType controllers |
| **Services**     | Core business logic services implemented       | —                                                            |
| **DTOs**         | —                                              | Request/response objects for all endpoints                   |
| **CORS**         | `WebConfig` configured                         | —                                                            |
| **Data Seeder**  | `DataInitializerService` seeded data           | —                                                            |
| **File Upload**  | Multipart config and static mapping done       | —                                                            |
| **Security**     | —                                              | Authentication, authorization, Spring Security               |
| **Frontend UI**  | All 5 components fully built                   | —                                                            |
| **API Service**  | Real `fetch()` calls active                    | —                                                            |
| **Notifications**| Dropdown panel and read functionality built    | —                                                            |
| **Route Guards** | —                                              | Protected routes, auth state checks                          |

---

## What Needs to Be Done

### Step 1: Backend Infrastructure (CORS, Data Seeder, Static Resources) ✅ DONE
Before building any endpoints, the backend needs foundational configuration.

1. **CORS Configuration:**
   - Create a `WebConfig` class implementing `WebMvcConfigurer`.
   - Allow origin `http://localhost:5173`, all HTTP methods, all headers, credentials.
   - Without this, the browser will block all frontend → backend requests.

2. **Data Seeder (`DataInitializerService`):**
   - Create a `@Service` with `@PostConstruct` to seed the database on startup.
   - Seed the 18 Pokémon types with name, color, and emoji (required for the Boss contest creation dropdown).
   - Seed at least 3 test users (one per role: BOSS, ANALISTA, ARTISTA) with a known password hash.
   - Optionally seed sample contests and submissions for development/testing.

3. **Static Resource Mapping:**
   - Configure Spring to serve uploaded artwork files from a local directory (e.g., `./uploads/artworks/`).
   - Map URL path `/uploads/**` to the file system directory.

### Step 2: Backend Controllers & Services (Core API) ✅ DONE
Build the REST API endpoints that the frontend's `api.js` expects to call. Each endpoint should have a corresponding `@Service` class for business logic.

1. **AuthController** (`/api/auth`):
   - `POST /api/auth/login` — Accept `{ username, password, role }`, validate credentials, return user object (and token if JWT is used).
   - The frontend `api.js` has a commented `fetch('/api/auth/login', ...)` call ready to uncomment.

2. **ContestController** (`/api/contests`):
   - `GET /api/contests` — Fetch all contests (with nested `pokemonTypes` and `pokemonRequest`).
   - `GET /api/contests/active` — Fetch contests where `status = ACTIVE`.
   - `GET /api/contests/{id}` — Fetch a single contest by ID with full details.
   - `GET /api/contests/boss/{bossId}/stats` — Return `{ totalActivity, pendingRequests }` for the Boss dashboard.
   - `POST /api/contests` — Create a new contest with `PokemonRequest` and linked `PokemonType` IDs.

3. **SubmissionController** (`/api/submissions`):
   - `GET /api/submissions?contestId={id}` — Fetch submissions for a specific contest.
   - `GET /api/submissions/artist/{artistId}` — Fetch an artist's own submissions.
   - `POST /api/submissions` — Accept multipart form data (file + contestId + attacks + comments). Save the `.jpg` file to disk, create a `Submission` record with status `PENDING`.
   - `PUT /api/submissions/{id}/review` — Accept `{ status, grade, feedbackNote }`. Update the submission. If status is DECLINED or REVISION, create a `Notification` for the artist.

4. **NotificationController** (`/api/notifications`):
   - `GET /api/notifications/user/{userId}` — Fetch all notifications for a user.
   - `GET /api/notifications/user/{userId}/unread-count` — Count unread notifications.
   - `PUT /api/notifications/{id}/read` — Mark a single notification as read.
   - `PUT /api/notifications/user/{userId}/read-all` — Mark all as read.

5. **PokemonTypeController** (`/api/pokemon/types`):
   - `GET /api/pokemon/types` — Fetch all 18 seeded Pokémon types (used by Boss contest creation form).

### Step 3: Swap Mock API Service for Real Backend Calls (Frontend) ✅ DONE
Once the backend endpoints exist, enable the frontend to use them.

1. **Uncomment the real `fetch()` calls** in each `apiService` method in `services/api.js` and remove the mock data / `delay()` returns.
2. **Align request/response shapes** — the mock data shapes may not match what the backend actually returns. Key areas to check:
   - `getBossDashboard()`: Mock returns `{ totalActivity, pendingRequests, activeRequests[] }`. Ensure the backend returns compatible fields.
   - `getAnalystDashboard()`: Mock returns `{ activeContests, pendingFromBoss, toValidate, avgValidationTime, submissions[] }`. The backend needs a dedicated analyst stats endpoint or the frontend must aggregate from multiple calls.
   - `getContestDetails(id)`: Mock returns flat stats. Backend will return nested `Contest` → `PokemonRequest`. Map appropriately.
   - `submitArtwork()`: Mock takes `(contestId, attacks, comments, file)` as separate args. Real call needs proper `FormData` construction.
   - `reviewSubmission()`: Mock takes `(id, action, grade, feedbackNote)`. Backend expects `{ status, grade, feedbackNote }`. Map `action` → `status`.
3. **Remove all mock constants** (`MOCK_POKEMON_TYPES`, `MOCK_CONTESTS`, `MOCK_SUBMISSIONS`) and the `delay()` helper.
4. **Add error handling** — mock calls never fail. Real calls need `try/catch` with user-facing error messages (toasts or inline alerts).

### Step 4: Analyst Stats Endpoint (Backend) ✅ DONE
The `AnalistaDashboard` expects a single `getAnalystDashboard()` response with aggregated stats, but the "Average Validation Time" is hardcoded to "1.2h" in the mock.

1. **Create `GET /api/analyst/stats`:**
   - `activeContests`: Count of contests where `status = 'ACTIVE'`.
   - `pendingFromBoss`: Count of contests where `status = 'PENDING'`.
   - `worksToValidate`: Count of submissions where `status IN ('PENDING', 'REVISION')`.
   - `averageValidationTime`: Compute from `reviewed_at - created_at` on reviewed submissions.
   - `submissions[]`: Pending submissions joined with artist user data and contest/pokémon details.

### Step 5: Authentication & Authorization (Security Hardening)
After the basic API is working, add proper security.

1. **Backend:**
   - Add `spring-boot-starter-security` to `build.gradle.kts`.
   - Verify `passwordHash` in the login flow (use BCrypt).
   - Implement JWT token issuance on login and validation on protected endpoints.
   - Add role-based access control: only BOSS → `POST /api/contests`, only ARTISTA → `POST /api/submissions`, only ANALISTA → `PUT /api/submissions/{id}/review`.

2. **Frontend:**
   - Store the JWT token in `localStorage` and attach as `Authorization: Bearer <token>` header on all API requests.
   - Add **route guards** — redirect unauthenticated users to `/` and restrict role-based navigation.

### Step 6: Notification Dropdown Panel (Frontend) ✅ DONE
The bell icon shows a hardcoded red dot but there is **no dropdown panel** to view or interact with notifications.

1. Create a `NotificationDropdown` component that:
   - Opens on bell icon click.
   - Fetches notifications via `GET /api/notifications/user/{userId}`.
   - Renders each with message, timestamp, and read/unread state.
   - Calls `PUT /api/notifications/{id}/read` on click.
   - Includes "Mark All as Read" action.
2. Replace the hardcoded red dot with a dynamic unread count.

### Step 7: Artist Dashboard Enhancements (Frontend)
`ArtistaDashboard.jsx` exists but is minimal — it only shows active contests as cards.

1. Add stats cards: Total Submissions, Accepted, Pending Review, In Revision (via `GET /api/submissions/artist/{artistId}`).
2. Add a table/list of the artist's past submissions with status badges.
3. Quick access to view revision feedback from the analyst.

### Step 8: Contest Auto-Completion Logic (Backend)
When an analyst accepts a submission, the backend should check if the parent contest has reached its quota.

1. Add a `requiredSubmissions` (or `quota`) field to the `Contest` entity.
2. In the review endpoint, after setting status to `ACCEPTED`:
   - Count accepted submissions for that contest.
   - If count >= quota → update `contest.status = 'COMPLETED'`.

### Step 9: Shared Component Extraction (Frontend Refactor)
The `Sidebar` and `TopNavbar` are **duplicated inline** in each dashboard component.

1. Extract into reusable components under `components/common/`.
2. Pass role, user data, and navigation callbacks as props.

### Step 10: Validation & Error Handling
1. **Backend:** Add `@NotNull`, `@NotBlank`, `@Size` annotations. Validate file types server-side. Return proper `400` responses.
2. **Frontend:** Client-side form validation. Toast notifications for API errors. Loading spinners and empty states.

---

## Summary — Priority Order

| Priority | Task                                          | Effort   | Where                | Status |
|----------|-----------------------------------------------|----------|----------------------|--------|
| 🔴 High  | Backend infra: CORS, seeder, static (Step 1) | Medium   | Backend              | ✅ Done |
| 🔴 High  | Backend controllers & services (Step 2)       | Large    | Backend              | ✅ Done |
| 🔴 High  | Swap mock API for real calls (Step 3)         | Medium   | Frontend (`api.js`)  | ✅ Done |
| 🟠 Med   | Analyst stats endpoint (Step 4)               | Small    | Backend + Frontend   | ✅ Done |
| 🟠 Med   | Notification dropdown panel (Step 6)          | Small    | Frontend only        | ✅ Done |
| 🟠 Med   | Auth & route protection (Step 5)              | Large    | Backend + Frontend   | ✅ Done |
| 🟡 Low   | Artist dashboard enhancements (Step 7)        | Small    | Frontend only        | ✅ Done |
| 🟡 Low   | Contest auto-completion (Step 8)              | Small    | Backend only         | ✅ Done |
| 🟡 Low   | Shared component extraction (Step 9)          | Medium   | Frontend refactor    | ✅ Done |
| 🟢 Nice  | Validation & error handling (Step 10)         | Medium   | Backend + Frontend   | ✅ Done |

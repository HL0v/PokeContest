# PokeContest

A full-stack platform for managing Pokémon-themed art contests, built with **Spring Boot** (backend), **React + Vite** (frontend), and **SQLite** for data persistence.

PokeContest coordinates three roles — **Boss**, **Analyst**, and **Artist** — through the full lifecycle of a contest: brief creation, artwork submission, and review.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Test Accounts](#test-accounts-seeded-data)
- [User Roles & Workflow](#user-roles--workflow)
- [Screens](#screens)
- [Database Schema](#database-schema)
- [License](#license)

---

## Overview

PokeContest orchestrates the creation, submission, and review of custom Pokémon assets:

- **Boss** — defines new contest briefs and manages team accounts.
- **Analyst** — reviews contest requirements and evaluates artist submissions.
- **Artist** — browses active briefs, uploads artwork, and submits attack specifications.

**Core data lifecycle:**

```text
Boss creates a contest
        │
        ▼
Artist submits artwork
        │
        ▼
Analyst reviews submission
        ├── Accept        → Contest marked completed
        └── Request revision → Artist notified and resubmits
```

---

## Tech Stack

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Backend    | Spring Boot 3.4 (Java 21), Spring Data JPA, Hibernate ORM |
| Database   | SQLite (embedded, via JDBC)                              |
| Frontend   | React 19, Vite, React Router DOM, Lucide React            |
| Build tools| Gradle (backend), npm (frontend)                          |

---

## Project Structure

```text
pokeContest/
├── .gitignore
├── README.md
├── backend/       # Spring Boot 3.4 · Java 21 · Gradle · SQLite
└── frontend/      # React 19 · Vite · JavaScript
```

---

## Getting Started

### Prerequisites

- Java 21 (JDK)
- Node.js 20+ and npm 10+

### Backend

```bash
cd backend
./gradlew bootRun
```

The REST API runs at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server runs at `http://localhost:5173`.

---

## Test Accounts (Seeded Data)

On startup, `DataInitializerService` seeds initial data into `backend/pokecontest.db`:

| Role     | Username        | Password   | Access & Responsibilities                          |
|----------|-----------------|------------|------------------------------------------------------|
| Boss     | `boss_admin`    | `password` | Create contest briefs, manage platform users          |
| Analyst  | `analyst_prime` | `password` | Review artist submissions and campaign requests       |
| Artist   | `arthur_v`      | `password` | Submit artwork and custom attack specifications        |

---

## User Roles & Workflow

### Authentication
A single login screen with a role selector (Boss, Analyst, Artist) authenticates credentials and redirects each role to its dedicated space.

### Boss
- **Dashboard** — overview of platform activity, active contest requests, and progress.
- **Management** — create and manage Analyst and Artist accounts.
- **Contest creation** — form to configure Pokémon stats, habitat, lore, and type attributes, with a real-time card preview.

### Analyst
- **Curation dashboard** — active-contest metrics, incoming Boss requests, and artist submissions awaiting approval.
- **Review workspace** — evaluate an artist's submitted artwork, attacks, and comments; assign a grade; accept, decline, or request revision (feedback note required for decline/revision).

### Artist
- **Workspace dashboard** — active contests and real-time status of submitted artwork.
- **Submission flow** — select a contest, review the Boss's requirements, upload artwork (`.jpg`), define attacks, and add comments. Submissions sent back for revision show the Analyst's feedback.

---

## Screens

| Screen               | Component              | Description                                                                 |
|-----------------------|-------------------------|-------------------------------------------------------------------------------|
| Login                 | `Login.jsx`             | Role selector with credential fields and role-based redirect.                 |
| Boss Dashboard         | `BossDashboard.jsx`     | Activity metrics and a table of active contest requests.                      |
| Analyst Dashboard      | `AnalistaDashboard.jsx` | Curation metrics, pending Boss requests, and a submissions review queue.      |
| Artist Dashboard       | `ArtistaDashboard.jsx`  | Submission stats and a list of active contests / past submissions.            |
| Contest Workspace      | `ContestPage.jsx`       | Role-specific view for creating, submitting to, or reviewing a contest.       |

---

## Database Schema

Relational schema persisted via SQLite and Spring Data JPA (`ddl-auto=update`).

```text
  ┌──────────┐ 1        N ┌──────────┐
  │  users   ├───────────►│ contests │
  └────┬─────┘            └────┬─────┘
       │ 1                     │ 1
       │                       ├───► 1:1 pokemon_requests
       │ N                     │
  ┌────▼───────┐ N        1    │ N
  │submissions ├───────────────┘
  └────────────┘
```

- **User → Contests**: 1:N (a Boss creates contests)
- **User → Submissions**: 1:N (an Artist submits work)
- **Contest → PokemonRequest**: 1:1 (base stats and lore)
- **Contest → Submissions**: 1:N (multiple submissions per contest)

### Key Tables

| Table               | Purpose                                                        |
|----------------------|------------------------------------------------------------------|
| `users`              | Platform accounts and roles (Boss, Analyst, Artist)               |
| `contests`           | Contest briefs created by a Boss, with status and priority        |
| `pokemon_requests`   | Pokémon attributes (stats, habitat, lore) tied to a contest        |
| `pokemon_types`      | Lookup table of the 18 Pokémon types                               |
| `submissions`        | Artwork, attacks, and comments submitted by an Artist              |
| `notifications`      | Messages pushed to users (e.g. a submission requiring revision)    |

---

## License

This project is provided as-is for personal and educational use.

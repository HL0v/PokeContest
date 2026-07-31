# PokeContest - SQLite Database Logic & Schema

This document outlines the relational database schema required to support the Contest Nexus application using SQLite. Since the backend relies on Spring Data JPA with `spring.jpa.hibernate.ddl-auto=update`, mapping these structures to Java Entities will automatically generate these tables.

## 1. Entity Relationship Diagram (ERD) Overview

The core entities are **Users** (Artists, Bosses, Analysts), **Contests** (created by the Boss, containing Pokémon requirements), and **Submissions** (artworks and attack designs sent by Artists). 

*   A **User** can create many Contests (if Boss).
*   A **User** can submit many Submissions (if Artist).
*   A **Contest** has ONE **PokemonRequest** (1:1 mapping of base stats and lore).
*   A **Contest** can have up to 2 **PokemonTypes** (Many-to-Many).
*   A **Contest** can have many **Submissions** (1:N).
*   A **Submission** belongs to one Contest and one Artist.

---

## 2. Table Definitions

### `users`
Stores all platform users and their roles.
*   `id` (INTEGER, Primary Key, Auto-increment)
*   `username` (VARCHAR, Unique, Not Null) - e.g., "Arthur_V"
*   `password_hash` (VARCHAR, Not Null)
*   `role` (VARCHAR, Not Null) - Enum: `BOSS`, `ANALISTA`, `ARTISTA`
*   `tier` (VARCHAR) - e.g., "Pro Artist" (Specific to Artists)
*   `avatar_color` (VARCHAR) - e.g., "avatar-yellow"
*   `initials` (VARCHAR) - e.g., "AR"
*   `created_at` (TIMESTAMP, Default CURRENT_TIMESTAMP)

### `pokemon_types`
A lookup table for the 18 Pokémon types (Used to populate the Boss dropdown).
*   `id` (INTEGER, Primary Key)
*   `name` (VARCHAR, Not Null) - e.g., "Água"
*   `color` (VARCHAR, Not Null) - e.g., "#6890F0"
*   `emoji` (VARCHAR) - e.g., "💧"

### `contests`
The overarching contest created by the Boss.
*   `id` (INTEGER, Primary Key, Auto-increment)
*   `boss_id` (INTEGER, Foreign Key -> `users.id`)
*   `title` (VARCHAR, Not Null) - e.g., "Campanha Lançamento Ethereal"
*   `status` (VARCHAR, Not Null) - Enum: `ACTIVE`, `PENDING`, `COMPLETED`
*   `priority` (VARCHAR) - Enum: `ROUTINE`, `CRITICAL`
*   `created_at` (TIMESTAMP)

### `pokemon_requests`
The specific Pokémon attributes required for the contest. (Can share the Contest ID as PK, or be a separate table).
*   `id` (INTEGER, Primary Key)
*   `contest_id` (INTEGER, Foreign Key -> `contests.id`)
*   `name` (VARCHAR, Not Null) - e.g., "Lapras"
*   `habitat` (VARCHAR)
*   `history` (TEXT)
*   `base_hp` (INTEGER)
*   `base_attack` (INTEGER)
*   `base_defense` (INTEGER)
*   `base_sp_atk` (INTEGER)
*   `base_sp_def` (INTEGER)
*   `base_speed` (INTEGER)

### `contest_pokemon_types` (Join Table)
Because a Pokémon can have 1 or 2 types.
*   `contest_id` (INTEGER, Foreign Key -> `contests.id`)
*   `type_id` (INTEGER, Foreign Key -> `pokemon_types.id`)
*   *Primary Key is the composite of (contest_id, type_id)*

### `submissions`
The artwork and details submitted by an Artist.
*   `id` (INTEGER, Primary Key, Auto-increment)
*   `contest_id` (INTEGER, Foreign Key -> `contests.id`)
*   `artist_id` (INTEGER, Foreign Key -> `users.id`)
*   `image_url` (VARCHAR, Not Null) - Path to the saved .jpg file
*   `attacks` (TEXT) - Artist's description of attacks
*   `comments` (TEXT) - Artist's notes
*   `status` (VARCHAR, Not Null) - Enum: `PENDING`, `ACCEPTED`, `DECLINED`, `REVISION`
*   `grade` (DECIMAL) - Analyst's grade (e.g., 9.5)
*   `feedback_note` (TEXT) - Required if declined or sent to revision
*   `created_at` (TIMESTAMP)
*   `reviewed_at` (TIMESTAMP)

### `notifications`
Messages pushed to users (e.g., when a submission is declined).
*   `id` (INTEGER, Primary Key, Auto-increment)
*   `user_id` (INTEGER, Foreign Key -> `users.id`)
*   `message` (TEXT, Not Null)
*   `is_read` (BOOLEAN, Default FALSE)
*   `created_at` (TIMESTAMP)

---

## 3. Essential Logic & Queries

Here is the logic required for the backend repositories to construct the data expected by the frontend API layer:

### A. Boss Dashboard Stats
To generate the metrics for `apiService.getBossDashboard()`:
*   **Total Activity:** Count all submissions across all contests created by this Boss.
    *   `SELECT COUNT(*) FROM submissions s JOIN contests c ON s.contest_id = c.id WHERE c.boss_id = ?`
*   **Pending Requests:** Count active contests that don't have enough accepted submissions yet.
*   **Active Requests List:** Join `contests`, `pokemon_requests`, and `pokemon_types`. Calculate the "progress" percentage based on the ratio of `ACCEPTED` submissions vs expected quota.

### B. Analyst Dashboard Stats
To generate the metrics for `apiService.getAnalystDashboard()`:
*   **Active Contests:** `SELECT COUNT(*) FROM contests WHERE status = 'ACTIVE'`
*   **Pending from Boss:** `SELECT COUNT(*) FROM contests WHERE status = 'PENDING'`
*   **To Validate:** `SELECT COUNT(*) FROM submissions WHERE status = 'PENDING' OR status = 'REVISION'`
*   **Submissions List:** Fetch submissions pending review, joining with `users` to get the Artist's avatar and tier, and joining with `pokemon_requests` to get the Pokémon name.

### C. Artist Dashboard & Submission
*   **Active Contests:** Fetch all contests where status is `ACTIVE`.
*   **When submitting (File Upload):** 
    1. The API receives the multipart form data.
    2. Saves the `.jpg` locally in a directory (e.g., `/uploads/artworks/`).
    3. Inserts a record into `submissions` with `image_url` pointing to the file path, and `status = 'PENDING'`.

### D. The Review Process (Analyst Logic)
When the analyst sends a `PUT /api/submissions/{id}/review`:
1.  Update `submissions` table: set `status`, `grade`, and `feedback_note`.
2.  If `status` is `DECLINED` or `REVISION`:
    *   Insert into `notifications` table: `user_id` = submission.artist_id, `message` = "Your submission for [Contest] requires attention: [feedback_note]".
3.  If `status` is `ACCEPTED`:
    *   Check if the parent contest has reached its required amount of accepted assets. If so, update `contests` table `status = 'COMPLETED'`.

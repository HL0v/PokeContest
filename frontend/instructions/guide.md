# PokeContest (Contest Nexus) - Implementation Guide & Next Steps

This document outlines the current state of the application and provides a step-by-step guide on what still needs to be implemented to make the application fully functional.

## Current State (Frontend Only)
- The frontend UI components (`Login`, `BossDashboard`, `AnalistaDashboard`, `ContestPage`) are built and linked together.
- The styling (`index.css`) is implemented, providing a modern, responsive design.
- All data currently displayed (Contests, Pokémon, Submissions, Stats) is **mock data** hardcoded in the frontend.

## What is NOT Implemented Yet

### Step 1: Backend Infrastructure Setup
Currently, the backend is an empty Spring Boot shell with only a health check endpoint.
1. **Database Schema:** Define and create the SQLite database schema.
2. **JPA Entities:** Create Java entities for `User`, `Contest`, `Pokemon`, and `Submission`.
3. **Repositories:** Create Spring Data JPA repositories for the entities.

### Step 2: Authentication & Authorization (Backend + Frontend)
1. **Backend Auth:** Implement basic authentication in Spring Boot (e.g., JWT or session-based) with role-based access control (BOSS, ANALYST, ARTIST).
2. **Frontend Auth:** 
   - Update `Login.jsx` to send a POST request to the backend with the username/ID and password.
   - Store the auth token (if using JWT) in `localStorage` or context.
   - Protect frontend routes so users can only access their specific dashboards/views.

### Step 3: Boss Implementation (API & Integration)
1. **Backend Endpoints:**
   - `GET /api/contests` (to fetch active requests for the dashboard).
   - `POST /api/contests` (to create a new contest/Pokémon request).
2. **Frontend Integration:**
   - Update `BossDashboard.jsx` to fetch real stats and active requests from the backend.
   - Update `BossContestView` in `ContestPage.jsx` to submit the form data to the backend.

### Step 4: Artist Implementation (API & Integration)
1. **Backend Endpoints:**
   - `GET /api/contests/active` (fetch contests available for submission).
   - `POST /api/submissions` (handle file upload and submission data).
   - File Storage: Implement a service to save uploaded `.jpg`/`.jpeg` files (e.g., local disk or cloud storage) and save the URL path to the database.
2. **Frontend Integration:**
   - Update `ArtistaContestView` to fetch active contests and display the real Boss attributes.
   - Implement `FormData` submission for the image and text fields.
   - (Optional but recommended) Create an `ArtistaDashboard` so artists can see their past submissions and statuses before jumping straight into the Contest form.

### Step 5: Analyst Implementation (API & Integration)
1. **Backend Endpoints:**
   - `GET /api/submissions?contestId={id}` (fetch submissions for review).
   - `PUT /api/submissions/{id}/status` (update status to ACCEPTED, DECLINED, or REVISION, and save the grade and feedback note).
2. **Frontend Integration:**
   - Update `AnalistaDashboard.jsx` to fetch real stats.
   - Update `AnalistaContestView` to fetch contests and submissions from the API.
   - Hook up the Accept/Decline/Revision buttons to send the `PUT` request with the feedback note.

### Step 6: Notification System
1. **Backend Logic:** Create a `Notification` entity to store messages for users (e.g., when a submission is declined or needs revision).
2. **Frontend Integration:**
   - Create a Notification dropdown component linked to the bell icon in the `TopNavbar`.
   - Fetch notifications periodically or via WebSockets to alert artists of Analyst feedback.

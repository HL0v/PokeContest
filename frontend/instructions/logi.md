# PokeContest (Contest Nexus) - Application Logic & Component Description

## 1. Overview
Contest Nexus is a platform designed to manage the creation, design, and validation of Pokémon assets. The application has three main roles: **Boss**, **Artist (Artista)**, and **Analyst (Analista)**.

## 2. Component Descriptions & Logic

### 2.1 Login Component (`Login.jsx`)
- **Purpose:** Serves as the entry point for the application.
- **Logic:** Users select their role (BOSS, ANALISTA, or ARTISTA) and click "AUTENTICAR NO SISTEMA".
  - **BOSS:** Navigates to `/boss`.
  - **ANALISTA:** Navigates to `/analista`.
  - **ARTISTA:** Navigates directly to their workspace at `/contest/artista` (since they don't have a dashboard yet).

### 2.2 Boss Dashboard (`BossDashboard.jsx`)
- **Purpose:** The main hub for the Boss role to oversee active requests and platform activity.
- **Components & Logic:**
  - Displays statistics (Total Activity, Pending Requests).
  - Lists active requests in a data table showing Pokémon type, habitat, status, and progress.
  - Clicking "Novo Pedido" (New Request) navigates the Boss to the Contest Page (`/contest/boss`) to create a new contest.

### 2.3 Analista Dashboard (`AnalistaDashboard.jsx`)
- **Purpose:** The curation hub for the Analyst role to manage contest requests and validate artist submissions.
- **Components & Logic:**
  - Displays metrics (Active Contests, Pending from Boss, Works to Validate, Average Validation Time).
  - Shows pending requests from the Boss and a table of pending artist submissions.
  - Clicking "Novo Concurso" (New Contest) or "REVISAR" (Review) on a routine request navigates to the Contest Page (`/contest/analista`) to review submissions.

### 2.4 Contest Page (`ContestPage.jsx`)
- **Purpose:** A dynamic component that renders a different view based on the URL parameter (`/contest/:role`). This is the core logic hub where the three roles interact with the contest data.

#### 2.4.1 Boss View (`/contest/boss`)
- **Logic:** The Boss creates a new contest by defining the Pokémon's attributes.
- **Features:**
  - Form fields for Contest Title, Pokémon Name, Habitat, and History.
  - A custom dropdown to select up to two Pokémon types (styled with colors and emojis).
  - Sliders/inputs for base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed).
  - A real-time Pokémon Card Preview that updates as the Boss fills out the form.

#### 2.4.2 Artist View (`/contest/artista`)
- **Logic:** The Artist selects an active contest, reviews the Boss's requirements, and submits their design.
- **Features:**
  - Dropdown to select an active contest.
  - Read-only display of the Pokémon attributes set by the Boss.
  - Textarea to define the Pokémon's attacks.
  - Drag-and-drop file upload zone for the design (accepts only `.jpg`/`.jpeg`).
  - Textarea for comments or notes.
  - If a submission was sent back for revision by the Analyst, a "Revision Banner" appears with the feedback note.

#### 2.4.3 Analyst View (`/contest/analista`)
- **Logic:** The Analyst reviews artist submissions for a specific contest and decides whether to accept, decline, or request a revision.
- **Features:**
  - Two cascading dropdowns: Select Contest -> Select Submission.
  - Displays the Artist's details (name, tier, status), the submitted Pokémon details, attacks, and comments.
  - Grade input field.
  - Action buttons:
    - **Aceitar (Accept):** Approves the submission.
    - **Recusar (Decline):** Rejects the submission; requires a mandatory feedback note.
    - **Enviar para Revisão (Send to Revision):** Sends it back to the Artist; requires a mandatory feedback note.

## 3. Data Flow
1. **Boss** creates a contest with specific requirements (`/contest/boss`).
2. **Artist** sees the active contest, creates a design, adds attack info, and submits it (`/contest/artista`).
3. **Analyst** reviews the submission (`/contest/analista`). They can:
   - Accept it (flow ends).
   - Decline it (Artist gets notified).
   - Request Revision (Artist updates their submission based on feedback).

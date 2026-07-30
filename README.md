
# PokéContest

A full-stack Pokémon contest application built with **Spring Boot** (backend) and **React + Vite** (frontend), using **SQLite** for persistence.

## Project Structure

```text
pokeContest/
├── .gitignore
├── README.md
├── backend/       # Java 21 · Spring Boot 3.4 · Gradle · SQLite
└── frontend/      # React 19 · Vite · JavaScript
```

## Prerequisites

- **Java 21** (JDK)
- **Node.js 20+** and **npm 10+**

## Getting Started

### Backend

```bash
cd backend
./gradlew bootRun
```

The API starts at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Tech Stack

| Layer      | Technology              |
|------------|------------------------|
| Backend    | Spring Boot 3.4 (Java 21) |
| Database   | SQLite (via JDBC)      |
| Frontend   | React 19 + Vite        |
| Build Tool | Gradle (backend), npm (frontend) |


## Running commands

# must be in /backend 
   - ./gradlew bootRun   
# must be in /frontend
    - npm run dev
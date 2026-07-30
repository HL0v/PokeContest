
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

---

### Architectural Breakdown: Why this setup?

When commanding an AI to build a system, ambiguity is the enemy. Here is the reasoning behind the specific constraints provided in the prompt, along with the standard industry sources they originate from.

**1. Using Vite instead of Create React App (CRA)**
*   **Why:** You might be used to `npx create-react-app`, but CRA was officially deprecated by the React team. Vite uses native ES modules, making the development server start up exponentially faster and hot-module replacement (HMR) virtually instant.
*   **Source:** The official [React documentation (Start a New React Project)](https://react.dev/learn/start-a-new-react-project) now specifically directs developers toward Vite or frameworks like Next.js rather than CRA.

**2. The Vite Proxy Configuration**
*   **Why:** By default, your React app runs on `localhost:5173` and Spring Boot runs on `localhost:8080`. If React tries to fetch data from the backend, the browser will block it due to Cross-Origin Resource Sharing (CORS) security policies. Setting a proxy in `vite.config.js` tricks the frontend into thinking the API is on the same port, completely bypassing CORS configuration during local development.
*   **Source:** [Vite Official Documentation - Server Proxy](https://vitejs.dev/config/server-options.html#server-proxy).

**3. SQLite Dialect in Spring Boot 3.x**
*   **Why:** SQLite isn't a traditional client-server database (like PostgreSQL or MySQL); it's a C-language library that reads/writes directly to a disk file (`data.db`). Historically, Spring's underlying ORM (Hibernate) didn't have native support for SQLite. While Hibernate 6 (which ships with Spring Boot 3) introduced better native SQLite support, explicitly declaring `org.hibernate.dialect.SQLiteDialect` and ensuring the `xerial` JDBC driver is present prevents the AI from hallucinating a generic SQL configuration that will crash on startup.
*   **Sources:** [Xerial SQLite-JDBC Repository](https://github.com/xerial/sqlite-jdbc) and [Hibernate ORM 6.0 Dialect Documentation](https://docs.jboss.org/hibernate/orm/6.0/userguide/html_single/Hibernate_User_Guide.html#database-dialect).

**4. The Monorepo Structure**
*   **Why:** Keeping both applications in one repository (`project-root/`) makes it significantly easier for an AI agent to read the entire codebase in one context window. It also ensures that your frontend and backend versions remain synchronized when you commit to version control.
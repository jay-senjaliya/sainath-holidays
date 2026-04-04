# Wanderlust Tour & Travel Platform

A production-ready Tour & Travel Agency platform built with Spring Boot 3, React 18, Vite, PostgreSQL, and Redis.

## Architecture Highlights
- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT + OAuth2), Hibernate, MapStruct
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, ShadCN UI, Zustand, React Query
- **Performance:** Sub-millisecond reads powered by Redis `@Cacheable` (Prod only), DB connection pooling via HikariCP, and N+1 query prevention.

---

## 💻 Local Development (Without Docker)
Since ports 8080 and 8081 are occupied on your system, the application has been permanently swapped to use **Port 8085** for the backend APIs. I have also **disabled Redis** exclusively in the `dev` profile so you don't need to install it locally.

You only need **Java 21**, **Node.js (v20+)**, and **PostgreSQL**.

### Step 1: PostgreSQL Setup
You must have a PostgreSQL server running locally (usually port `5432`).
Ensure you create a database with credentials matching the backend defaults:
1. Open your PostgreSQL terminal/pgAdmin.
2. Run the following queries to create the DB and User:
   ```sql
   CREATE DATABASE tourtravel;
   CREATE USER tourtravel_user WITH PASSWORD 'tourtravel_pass';
   GRANT ALL PRIVILEGES ON DATABASE tourtravel TO tourtravel_user;
   -- (Optional) Give schema privileges depending on Postgres 15+ restrictions
   ALTER DATABASE tourtravel OWNER TO tourtravel_user;
   ```

### Step 2: Start the Backend (Spring Boot on Port 8085)
Open a new terminal and run:
```bash
cd tourtravel-backend
# Automatically uses application-dev.yml which targets Port 8085, sets ddl-auto=create-drop, and runs seed.sql!
export SPRING_PROFILES_ACTIVE=dev 
mvn clean spring-boot:run
```
> **Verification:** Once running, you should see `Tomcat started on port 8085`. The backend will automatically create the tables and throw fake data in via `seed.sql`.

### Step 3: Start the Frontend (Vite on Port 5173)
Open a second terminal and run:
```bash
cd tourtravel-frontend
npm install
npm run dev
```
> **Verification:** The frontend runs on `http://localhost:5173`. The proxy config (`vite.config.ts`) has been updated to funnel all API requests to `http://localhost:8085/api` automatically to match the backend.

---

## 🚀 Production (With Docker)
If you install Docker heavily in the future, the stack still natively supports full containerization orchestrating Postgres, Redis, Nginx, and Spring on isolated network bridges.

```bash
docker-compose up --build -d
```
# sainath-holidays

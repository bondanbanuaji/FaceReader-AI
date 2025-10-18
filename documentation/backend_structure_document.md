# Backend Structure Document

This document provides a clear overview of the backend setup for the FaceReader-AI starter template. It explains how each piece fits together, from the API and database to hosting and security, in everyday language.

## 1. Backend Architecture

- **Framework & Design**
  - Uses Next.js API Routes as serverless functions for all backend logic.
  - Follows a modular folder structure:
    - `/app` for pages and API routes
    - `/db` for database connection and schema
    - `/lib` for shared utilities and authentication setup
- **Design Patterns**
  - Separation of concerns: API routes act as controllers, Drizzle ORM schemas act as models, and Next.js pages/components are views.
  - TypeScript throughout ensures type-safe code and fewer runtime errors.
- **Scalability, Maintainability, Performance**
  - Serverless functions on Vercel automatically scale up or down based on traffic.
  - Clear module boundaries make it easy to add or swap features (e.g., new APIs, data models).
  - Next.js server components and Turbopack speed up rendering and builds.

## 2. Database Management

- **Database Technology**
  - PostgreSQL (relational SQL database)
  - Drizzle ORM for type-safe queries and schema definitions
- **Data Workflow**
  - Local development uses Docker Compose to spin up a Postgres instance consistently.
  - Production uses a managed Postgres service (e.g., Heroku Postgres or AWS RDS).
- **Data Practices**
  - Schema definitions in `/db/schema/*.ts` keep database design close to the application code.
  - Environment variables control connection strings and credentials, avoiding hard-coded secrets.
  - Drizzle migrations (when added) handle schema changes over time.

## 3. Database Schema

Below is a human-readable summary of the main tables, followed by a SQL version you could run in PostgreSQL.

### Human-Readable Table Descriptions
- **Users**: Stores each user’s email, name, profile image URL, hashed password, and timestamps.
- **Sessions**: Tracks active login sessions with a token, expiration date, and reference to the user.
- **Accounts**: (If using OAuth) Links a user to an external provider (e.g., Google, GitHub) with provider-specific tokens.
- **VerificationTokens**: Stores one-time tokens for actions like email verification or password reset.

### SQL Schema (PostgreSQL)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT PRIMARY KEY,
  expires_at TIMESTAMP NOT NULL
);
```  

## 4. API Design and Endpoints

- **Style**: RESTful APIs implemented with Next.js API Routes.
- **Key Endpoints**:
  - `POST /api/auth/signup` – Create a new user account.
  - `POST /api/auth/signin` – Validate credentials and start a session.
  - `POST /api/auth/signout` – Invalidate the current session.
  - `GET  /api/auth/session` – Retrieve details of the logged-in user.
- **Integration Flow**:
  1. Frontend form submits credentials to `/api/auth/signin`.
  2. The API route calls Better Auth helpers in `/lib/auth.ts`.
  3. Better Auth uses Drizzle ORM to check the database and manage sessions.
  4. API returns success or error; frontend updates UI accordingly.

## 5. Hosting Solutions

- **Local Development**:
  - Docker Compose runs a Node.js container for the app and a Postgres container.
  - Ensures every developer has the same environment.
- **Production Deployment**:
  - Vercel handles building and deploying the Next.js application.
  - Benefits of Vercel:
    - Automatic SSL/TLS for secure connections
    - Global CDN for fast asset delivery
    - Auto-scaling serverless functions
    - Zero-config deployments from GitHub

## 6. Infrastructure Components

- **Load Balancing & Scaling**:
  - Vercel’s infrastructure automatically spreads traffic and scales serverless functions.
- **Content Delivery Network (CDN)**:
  - Static assets (images, CSS, JS) are served via Vercel’s global CDN for minimal latency.
- **Caching**:
  - Next.js ISR (Incremental Static Regeneration) and HTTP cache headers speed up page loads.
- **Containerization**:
  - Docker ensures consistent builds and local testing.

## 7. Security Measures

- **Authentication & Authorization**:
  - Better Auth library handles sign-up, sign-in, session tokens, and guards protected routes.
  - Server-side checks on every protected API route and page.
- **Data Encryption**:
  - Passwords are securely hashed before storage (e.g., bcrypt).
  - TLS encryption in transit via HTTPS (Vercel uses Let’s Encrypt).
  - At-rest encryption managed by the Postgres provider.
- **Secret Management**:
  - Sensitive values (database URLs, auth secrets) are stored in environment variables, not in code.
- **Common Best Practices**:
  - Input validation on both client and server.
  - Prepared statements via Drizzle ORM protect against SQL injection.
  - Helmet (or equivalent) headers can be added for additional security.

## 8. Monitoring and Maintenance

- **Logging & Metrics**:
  - Vercel provides real-time logs for each deployment and function call.
  - Application logs (console statements) surface in the Vercel dashboard.
- **Error Tracking**:
  - Option to integrate Sentry, LogRocket, or Datadog for deeper monitoring.
- **Maintenance Strategy**:
  - Automated deployments on merge to main branch keep production up to date.
  - Scheduled backups for Postgres (handled by the DB provider).
  - Periodic dependency updates via Dependabot or Renovate.

## 9. Conclusion and Overall Backend Summary

The FaceReader-AI backend is built on a modern, serverless-friendly stack that balances developer productivity with real-world reliability:

- **Next.js API Routes + Better Auth** give you secure, ready-made authentication.
- **PostgreSQL + Drizzle ORM** bring type-safe, scalable data management.
- **Docker + Vercel** cover both consistent local development and painless cloud deployment.
- **Built-in security, monitoring, and modular design** make it easy to extend, maintain, and scale.

Together, these components form a solid backend foundation you can trust for a variety of web applications—whether you’re adding AI features, analytics dashboards, or any other business logic on top.
# FinAppAI — Personal Finance Manager (Frontend)

Modern, responsive web interface for managing personal finances, built with Next.js 15 and TypeScript.

## 📋 Overview

This is the frontend for FinAppAI. It enables users to:

- 👤 Register and authenticate
- 💰 Manage bills/expenses
- 📊 Create and manage financial plannings
- 🤖 Generate AI-assisted financial plans
- 🔐 Recover password via email
- 📱 Use a clean, responsive UI

## 🔗 Backend API

This app consumes a REST API. Configure the base URL via environment variables (see Environment section). The client expects endpoints for authentication, users, bills, plannings, and AI plan generation.

## 🚀 Tech Stack

- **[Next.js 15](https://nextjs.org/)** — React framework with App Router
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Axios](https://axios-http.com/)**

## 📦 Getting Started

### Requirements

- Node.js v18+
- npm, yarn, or pnpm
- Running Backend API

### Environment Variables

Use the provided example and create your `.env` file at the project root:

```bash
cp .env.example .env
```

Configure at least:

```env
# Port used by the Next.js dev/prod server (optional; defaults to 3001 in scripts)
PORT=3001

# Base URL of the backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Notes:
- The Axios client reads `NEXT_PUBLIC_API_URL` and falls back to `http://localhost:3000` if not provided.
- The dev/start scripts default to port 3001 when `PORT` is not set.

### Install & Run

```bash
# Install dependencies
npm install

# Development (defaults to http://localhost:3001)
npm run dev

# Production build
npm run build

# Start production server (defaults to http://localhost:3001)
npm run start

# Lint
npm run lint
```

## 🧭 App Routes (UI)

- `/login` — Sign in
- `/register` — Sign up
- `/dashboard` — Overview and user summary
- `/contas` — Bills/expenses management
- `/planejamento` — Plannings list and creation (manual and AI)
- `/settings` — Profile and preferences

## 📚 API Integration (expected endpoints)

The frontend uses these endpoints (relative to `NEXT_PUBLIC_API_URL`):

- Auth: `POST /register`, `POST /login`, `POST /forgot-password?email=...`, `POST /reset-password?token=...`
- Users: `GET /user`, `GET /users`, `POST /users`, `PUT /users`, `DELETE /users/:id`, `GET /user-summary`
- Bills: `GET /bills`, `GET /bill?id=...`, `POST /bills`, `PUT /bills`, `DELETE /bills/:id`
- Plannings: `GET /plannings`, `GET /planning?id=...`, `POST /plannings`, `PUT /plannings`, `DELETE /plannings/:id`, `POST /generate-planning`

Security/UX behavior:
- JWT is stored in `localStorage` and automatically attached as `Authorization: Bearer <token>`.
- On `401` responses, local auth is cleared and the app redirects to `/login`.

## 🎨 Features

### Authentication
- Login and registration
- Password recovery via email
- Protected routes for authenticated users

### Bills Management
- List, create, edit, and delete bills
- Filtering and pagination

### Financial Plannings
- List all plannings
- Create planning manually
- Generate planning with AI assistance
- Edit and delete plannings
- Track progress of goals

### User Profile
- View and edit personal data
- Update password
- App settings/preferences

## 📄 License / Academic Note

This project is part of an academic graduation thesis (TCC).

---

Built with ❤️ using Next.js 15 + TypeScript + Tailwind CSS
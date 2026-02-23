# Cafecito POS

> A modern, full-stack Point of Sale system for coffee shops, built for speed, reliability, and a seamless user experience.

---

## Table of Contents
- [Project Description](#project-description)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables Example](#environment-variables-example)
- [Seed Instructions](#seed-instructions)
- [Technical Decisions](#technical-decisions)
- [License](#license)

---

## Project Description

**Cafecito POS** is a robust, role-based Point of Sale system designed for coffee shops. It streamlines product management, customer assignment, and sales, providing a modern UI and secure backend. Built with Angular 17 (standalone components) and Node.js/Express, it leverages MongoDB for data storage and JWT for authentication.

---

## Architecture Overview

**Frontend:**
- Angular 17 (Standalone Components)
- Reactive Forms, RxJS
- HTTP Interceptors (Auth & Error)
- Role-based UI rendering
- Modal-based ticket generation

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (Access + Refresh Token)
- Role-based middleware (admin/seller)
- Global error handler
- Zod validation
- Seed scripts for products and customers

**Folder Structure**

```
cafesito-pos/
│
├── backend/
│   ├── src/
│   │   ├── config/              # DB, initializeData, env helpers
│   │   ├── controllers/       # Route handlers
│   │   ├── middlewares/       # auth, role checks, validation, error handlers
│   │   ├── models/            # Mongoose schemas (Customer, Product, Sale, User)
│   │   ├── routes/            # Express routers
│   │   └── seeds/             # seedProducts.js, seedCustomers.js
│   ├── .env
│   └── server.js
│
└── frontend/
  ├── src/
  │   ├── app/
  │   │   ├── core/             # Singletons and app-wide utilities
  │   │   │   ├── directives/    # e.g. hasrole.directive.ts
  │   │   │   ├── guards/        # auth.guard.ts, role.guard.ts
  │   │   │   ├── interceptors/  # auth.interceptor.ts, error handling
  │   │   │   ├── services/      # auth, product, customer, sale services
  │   │   │   └── types/         # shared TypeScript types/interfaces
  │   │   ├── pages/            # Feature routes implemented as standalone components
  │   │   │   ├── clientes/
  │   │   │   ├── login/
  │   │   │   ├── productos/
  │   │   │   ├── register/
  │   │   │   └── ventas/        # POS screen + cart
  │   │   ├── shared/           # Reusable components (modals, buttons, lists)
  │   │   ├── layout/           # shells, sidebar, header
  │   │   │   ├── publicshell/
  │   │   │   ├── shell/
  │   │   │   └── sidebar/
  │   │   └── app.routes.ts
  │   ├── assets/               # images, fonts, icons
  │   ├── environments/         # environment.ts, environment.development.ts
  │   ├── styles.css / tailwind/ # global styles + Tailwind config
  │   └── index.html
  ├── angular.json
  ├── package.json
  └── README.md                # frontend-specific notes (optional)

```

Notes:
- The `core` folder contains single-instance services, guards and interceptors used across the app.
- `pages` groups feature screens (each can be a standalone component in Angular 17).
- `shared` hosts presentational components and generic UI pieces such as the ticket modal used by the POS screen.
- Keep `interceptors` light: one for attaching access tokens, another for centralized error handling and refresh token logic.

---

## Features

- **Product Management:**
  - CRUD operations with pagination and search
- **Customer Assignment:**
  - Optional, by phone or email lookup
- **Dynamic Cart:**
  - Add/remove products, real-time updates
- **Ticket Generation:**
  - Modal-based, printable tickets
- **Role-Based Access Control:**
  - Admin and seller roles, UI adapts to permissions
- **Authentication:**
  - JWT with refresh tokens, secure session management
- **Error Handling:**
  - Global error handler (backend), HTTP error interceptor (frontend)
- **Seed Scripts:**
  - Populate database with demo products and customers

---

## Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud)

### 1. Clone the repository
```bash
git clone <repository-url>
cd cafesito-pos
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # or create .env manually (see below)
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Running the Application

**Start Backend:**
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

**Start Frontend:**
```bash
cd frontend
ng serve
```

The frontend will be available at `http://localhost:4200` and the backend API at `http://localhost:3001/api` by default.

---

## Environment Variables Example

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=cafecito-pos
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONT_APP_URL=http://localhost:4200
INITIAL_DATA=development
```

---

## Seed Instructions

To populate the database with demo products and customers:

```bash
# From backend directory
node src/seeds/seedProducts.js
node src/seeds/seedCustomers.js
```

Or, if INITIAL_DATA=development is set in your .env, initial data may be loaded automatically on server start.

---

## Technical Decisions

- **Angular Standalone Components:**
  - Reduces boilerplate, improves modularity and performance.
- **Reactive Forms & RxJS:**
  - Enables robust, scalable form handling and state management.
- **HTTP Interceptors:**
  - Centralized authentication and error handling for all API calls.
- **Role-Based UI & Middleware:**
  - Ensures both frontend and backend enforce permissions.
- **JWT with Refresh Tokens:**
  - Secure, scalable authentication for modern SPAs.
- **Zod Validation:**
  - Type-safe, declarative validation for backend data.
- **Seed Scripts:**
  - Simplifies onboarding and testing with demo data.
- **Global Error Handling:**
  - Consistent error responses and logging.

---

## License

This project is licensed under the MIT License.

# Project Nexus :: Developer Ecosystem

A high-performance, full-stack task and project management ecosystem built with a "terminal-first" aesthetic. This project demonstrates modern web engineering practices, including server-side state synchronization, robust authentication patterns, and highly responsive UI/UX.

## 🚀 Technical Stack

### Frontend (Client)

- **Framework:** React 18 (Vite)
- **Language:** TypeScript (Strict Mode)app
- **State Management:** TanStack Query (React Query v5) for efficient server-state handling
- **Styling:** Tailwind CSS v4 + Custom Utility Engine
- **Animations:** Motion (Framer Motion) for fluid, physics-based transitions
- **Icons:** Lucide-React

### Backend (Server)

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js 5
- **ORM:** Prisma with PostgreSQL
- **Auth:** JWT + Refresh Token rotation (Secure HTTP-only Cookies)
- **Validation:** Zod for robust request schema enforcement
- **API Architecture:** Layered Service Architecture (Controllers > Services > Prisma)
- **Security:** Rate limiting, CORS, and role-based access control (RBAC)

## 🛠️ Key Engineering Features

### 1. Server-State Synchronization

Used **TanStack Query** to manage asynchronous data fetching. This implementation ensures zero-flicker UI updates by leveraging optimistic updates and intelligent cache invalidation logic.

### 2. Sophisticated UI/UX Implementation

- **Cyber-System Design:** A modern design system built from scratch using Tailwind CSS, focusing on high-contrast accessibility and data density.
- **Layout Persistence:** Implemented custom Layout components and specialized Sidebar navigation to maintain context across 5+ specialized views.

### 3. Service-Layer Architecture

The backend is organized into a clean service-based architecture:

- **Controllers:** Handle HTTP logic and request validation via Zod.
- **Services:** Housing the core business logic (e.g., habit toggling, task orchestration).
- **Prisma:** Managing type-safe database interactions.

### 4. Advanced Security Implementation

- **Double-Token Auth:** Stateless flow using short-lived Access Tokens and long-lived Refresh Tokens stored in HTTP-only cookies.
- **Role-Based Guards:** Middleware-level checks for administrative routes.
- **Rate Limiting:** Protects auth endpoints against brute-force attacks.

## 🚧 Roadmap & Features in Development

The following modules are currently implemented on the frontend to showcase UI/UX design and state management capabilities, with full backend integration in progress:

- **System Monitoring:** Real-time performance metrics and infrastructure status visualization.
- **Advanced Logging:** Comprehensive system-wide event audit trail.
- **User Settings:** Granular profile management and UI customization engine.

## 📁 Architecture

```text
/src (Frontend)
  ├── api/           # Axios services for Backend communication
  ├── components/    # Atomic UI components (Dashboard, Sidebar, etc.)
  ├── hooks/         # Custom hooks (useAuth, useTasks, etc.)
  └── pages/         # Route-level views

/devtasks-server (Backend)
  ├── src/
  │   ├── controllers/ # HTTP Request handlers
  │   ├── services/    # Business logic & DB operations
  │   ├── middleware/  # Auth & Role validation
  │   ├── routes/      # Endpoint definitions
  │   └── lib/         # Prisma client & shared instances
  └── prisma/          # Schema & migrations
```

## 🔐 Auth Implementation

The application uses a secure authentication flow with JWTs. Access tokens are transmitted via secure cookies, while Refresh Tokens allow for seamless session persistence without compromising security. All requests are validated against a strict Zod schema before processing.

---

_Developed as a showcase of modern Full-Stack capabilities._

# Bruvi HQ Admin & Enterprise ERP Portal

> **Mission-Critical Web Command Center & ERP for Bruvi Coffee Ecosystem**  
> Managing 12+ physical outlets, central roasteries, live barista queues, automated Bill-of-Materials (BOM), GSTR-1/3B tax compliance, and a 34-rider hyper-local delivery fleet.

---

## 1. Architectural Highlights

- **Framework**: **Next.js 16.4 (App Router)** with **Turbopack** enabled for both dev & production builds.
- **UI Engine**: **React 19.3** with React Compiler, Server Components, and Streaming Suspense.
- **Styling**: **Tailwind CSS v4 (v4.3.3)** — modern CSS-first engine using `@theme` definitions (zero `tailwind.config.js`).
- **Security & Proxy**: Next.js 16 `src/proxy.ts` enforcing strict nonce-based CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.
- **Backend-for-Frontend (BFF)**: Route handler proxy at `/api/proxy/[...path]` securely shielding backend URLs and propagating correlation IDs.
- **Operational Resilience**:
  - **AS01**: Shimmer skeleton fallbacks (`loading.tsx`).
  - **AS02**: Contextual empty states with primary actions.
  - **AS03**: Error recovery boundaries (`error.tsx`).
  - **AS04**: Cryptographic 403 Access Denied views (`forbidden/page.tsx`).
  - **AS05**: Idle session timeout modal with **form input preservation**.
  - **AS06**: Non-blocking sticky offline & stale data warning banner.

---

## 2. Directory Structure

```
bruvi_admin/
├── src/
│   ├── app/                      # App Router Layer
│   │   ├── (auth)/               # Unauthenticated Flows (Isolated Layout)
│   │   │   └── login/            # Dual Corporate Sign-in (SSO & Work Email)
│   │   ├── (dashboard)/          # Authenticated Operational Shell
│   │   │   ├── layout.tsx        # Persistent Shell (Sidebar + Topbar + Banners)
│   │   │   ├── page.tsx          # Executive Cockpit (Overview of all 18 domains)
│   │   │   ├── orders/           # Omnichannel Live Orders Queue
│   │   │   ├── stores/           # Multi-Store & Hardware Pairing
│   │   │   ├── catalog/          # Product Hierarchy & Modifiers
│   │   │   └── dispatch/         # Live Fleet GIS Command Center
│   │   ├── api/                  # Server-Side API Handlers
│   │   │   ├── health/           # Operational Health Probe
│   │   │   └── proxy/[...path]/  # Secure BFF Gateway to NestJS
│   │   ├── error.tsx             # Resilient Runtime Error Boundary (AS03)
│   │   ├── forbidden/            # Role-gated 403 Handler (AS04)
│   │   ├── loading.tsx           # Streaming Skeleton Fallback (AS01)
│   │   ├── not-found.tsx         # 404 Handler
│   │   └── globals.css           # Tailwind v4 @theme Tokens
│   ├── components/               # Design System Components
│   │   ├── feedback/             # AS01 - AS07 Operational Feedback Widgets
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-fallback.tsx
│   │   │   ├── offline-banner.tsx
│   │   │   └── session-timeout-modal.tsx
│   │   ├── layout/               # Shell Infrastructure
│   │   │   ├── command-menu.tsx  # Global ⌘K Quick Action Palette
│   │   │   ├── sidebar.tsx       # Collapsible Domain Navigation
│   │   │   ├── store-switcher.tsx# Multi-Store Scope Selector
│   │   │   └── topbar.tsx        # Sticky Header with SLA Timers
│   │   └── ui/                   # Accessible Primitives (Button, Badge, Card, etc.)
│   ├── config/                   # Configuration & Schemas
│   │   ├── env.ts                # Zod-validated Environment Variables
│   │   └── navigation.ts         # Canonical 18-Domain Navigation Schema
│   ├── features/                 # Domain-Driven Vertical Slices
│   │   ├── dispatch/             # Live Fleet GIS & Polygon Editor
│   │   ├── inventory/            # Live Store Ledger & Spoilage Logs
│   │   ├── orders/               # Omnichannel Transaction Streams
│   │   └── stores/               # Outlet Master & Hardware Terminals
│   ├── lib/                      # Foundational Libraries & Utilities
│   │   ├── api/client.ts         # Typed Fetch Client with Correlation IDs
│   │   ├── security/             # CSP Generator & RBAC Capabilities
│   │   ├── supabase/             # Client & Server Auth Bridges
│   │   └── utils/                # INR ₹ Currency & Date Formatters
│   ├── providers/                # Client Context Providers
│   │   ├── app-provider.tsx      # Root Event & Keyboard Provider
│   │   └── query-provider.tsx    # TanStack React Query Provider
│   ├── stores/                   # Global Client State
│   │   └── use-app-store.ts      # Zustand Store
│   ├── types/                    # Shared Contracts & Envelopes
│   │   ├── api.ts                # Standard Response & Error Envelopes
│   │   ├── auth.ts               # Roles & 4-Tier Capability Matrix
│   │   └── store.ts              # Store & Outlet Metadata
│   └── proxy.ts                  # Next.js 16 Edge Proxy & Security Boundary
├── .env.example                  # Environment Template
├── .env.local                    # Local Development Configuration
├── next.config.ts                # Next.js 16 Turbopack & React Compiler Config
├── package.json                  # Dependencies & Scripts
└── tsconfig.json                 # TypeScript Configuration with Strict Checks
```

---

## 3. Getting Started

### Development Mode
```bash
# Start development server on port 3001 with Turbopack
pnpm dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### Type-Check & Lint
```bash
pnpm type-check
pnpm lint
```

### Production Build
```bash
pnpm build
pnpm start
```

---

## 4. Branching Strategy & Git Workflow

The repository follows a multi-tier branch deployment model:

| Branch | Target Environment | Purpose |
| :--- | :--- | :--- |
| `development` | Development (`dev-admin.bruvi.com`) | Active feature development and fast integration testing. |
| `staging` | Staging (`staging-admin.bruvi.com`) | Release candidates, QA validation, and pre-production testing. |
| `production` | Production (`admin.bruvi.com`) | Live enterprise deployment serving active outlets and operations. |
| `main` | Default Repository Trunk | Stable release coordination and synced production state. |

### Pull Request & Promotion Workflow
1. Feature branches branch off `development`.
2. PRs are reviewed and merged into `development`.
3. Tested versions in `development` are promoted to `staging` for QA sign-off.
4. Validated releases are promoted to `production` and fast-forwarded to `main`.

---

## 5. CI/CD Pipeline Automation

Automated continuous integration and deployment workflows are powered by GitHub Actions in `.github/workflows/`:

- **CI Pipeline (`.github/workflows/ci.yml`)**:
  - Triggers on push and PR to `development`, `staging`, `production`, and `main`.
  - Runs automated linting (`pnpm lint`), type verification (`pnpm type-check`), and production build verification (`pnpm build`).
- **CD Pipeline (`.github/workflows/deploy.yml`)**:
  - Branch-conditioned deployments across `development`, `staging`, and `production`.
  - Configurable for Vercel, AWS ECS, Google Cloud Run, or Kubernetes container deployments.


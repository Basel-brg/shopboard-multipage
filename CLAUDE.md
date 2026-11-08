# ShopBoard Multi-Page (React Edition) - Engineering Standards & Guidelines

This document serves as the single source of truth for engineering practices, architecture decisions, and coding standards on this project.

---

## 1. The Stack & Architecture

- **Runtime & Build**: React 19, Vite 8, TypeScript (Strict Mode, 0 `any`, 0 `as`, 0 `!`).
- **Routing**: `react-router-dom` v7 with Client-Side Routing, Route Layouts, Code Splitting (`React.lazy()`), and Suspense.
- **Form Management & Validation**: `react-hook-form` with `@hookform/resolvers/zod` and strict Zod schemas.
- **State Management**: Native React Context API (`CartContext`, `ProductsContext`, `OrdersContext`, `AuthContext`, `ToastContext`). Zero redundant/duplicated state.
- **3D Graphics Engine**: Three.js via `@react-three/fiber` & `@react-three/drei` (Akari Desk Atelier 3D Customizer).
- **Styling**: Pure CSS3 with `:root` CSS Design Tokens, Akari Desk Atelier design system, responsive layout, full RTL support (`dir="rtl"`).
- **Testing**: Vitest + React Testing Library (Pure logic unit tests & component tests).
- **Code Quality**: ESLint 9 (Flat Config), Prettier, Husky pre-commit hook enforcing `lint-staged` and `typecheck`.

---

## 2. Multi-Page Routing & Lazy Loading Architecture

- **Shared Layout (`src/layouts/RootLayout.tsx`)**:
  - Global navigation header with active `NavLink` styling and dynamic cart item counter.
  - Desk 3D Studio modal orchestration bridge.
  - Root `ErrorBoundary` with actionable "إعادة المحاولة (Try again)" reset action.
  - Page-level `<Suspense fallback={<PageSkeleton />}>` surrounding `<Outlet />`.
- **Pages (Code-Split via `React.lazy`)**:
  1. `/` -> `HomePage.tsx`: Catalog hero, categories, filter bar, quick view, product grid with 4-state lifecycle.
  2. `/products/:id` -> `ProductDetailPage.tsx`: Dedicated product view loading from API by ID, quantity controls, specifications, reviews, and stock status.
  3. `/cart` -> `CartPage.tsx`: Full cart management view, coupon application, subtotal/shipping/vat calculation, item removal, and checkout gateway.
  4. `/checkout` -> `CheckoutPage.tsx`: Validated checkout form with customer information, national address, and payment method selection.
  5. `/orders` -> `OrdersPage.tsx`: Order history, status timeline tracker, and cancellation actions.
  6. `*` -> `NotFoundPage.tsx`: 404 error page with clear navigation back to catalog.

---

## 3. Rules from Real Mistakes We Saw & Solved

### Rule 1: Never Mutate Arrays In-Place

- **Problem**: Calling `.sort()` or `.splice()` directly on state arrays or catalog objects mutates data in-place, breaks the "Default" order, and introduces subtle re-render loops.
- **Enforcement**: Always shallow copy before sorting (`[...items].sort(...)`). Keep sorting and filtering algorithms isolated in pure logic files (`*.logic.ts`).

### Rule 2: Centralized API Client Only — Never Raw `fetch()`

- **Problem**: Calling `fetch('/api/...')` directly in components causes duplicated error handling, leaks base URLs, and bypasses unified simulation endpoints.
- **Enforcement**: Route every request through `apiClient` in `src/shared/api/client.ts`. Support `/delay/3000`, `/fail/500`, and `/empty` simulation paths natively.

### Rule 3: Zero `any`, Zero Unchecked `as`, Zero Non-Null `!` Assertions

- **Problem**: Using `as any` or `!` hides runtime bugs from the TypeScript compiler, leading to `undefined is not a function` at runtime.
- **Enforcement**: Use strict interface contracts, generic return types (`apiClient<T>`), and type guards (`instanceof Error`).

### Rule 4: Granular State Ownership — No Global Clutter

- **Problem**: Placing component-local state (e.g., active dropdown, modal open/close, hover states) into global Context causes unnecessary re-renders of the entire page.
- **Enforcement**: Shared cross-page state (Cart, User, Orders) lives in dedicated Context providers. Ephemeral UI state stays inside the component that owns it. Derived values (cart totals, discounts, taxes) are computed via pure functions, never stored as duplicate state.

### Rule 5: Code-Splitting and Error Boundary Isolation

- **Problem**: Loading all pages in a single monolithic bundle slows initial page loads, and an unhandled error on one page crashes the entire application.
- **Enforcement**: All route pages MUST use `React.lazy()` with `<Suspense>`. Wrap routes with `ErrorBoundary` so a failure on one page or component displays an actionable "Try again" without breaking navigation.

---

## 4. Verification & Development Commands

```bash
npm run dev           # Start Vite dev server with HMR
npm run build         # Check types (tsc -b) and bundle into dist/
npm run typecheck     # TypeScript strict verification
npm test              # Run unit tests via Vitest
npm run lint          # Run ESLint static analysis
npm run format:check  # Check formatting with Prettier
```

# ShopBoard (Multi-Page React Edition)

A modern, high-performance, multi-page e-commerce web application built with **React 19**, **Vite 8**, **TypeScript**, and **react-router-dom** v7, featuring an interactive 3D WebGL Desk Customizer powered by Three.js.

---

## 1. Routes & Multi-Page Architecture

All routes share a common layout (`RootLayout`) with persistent navigation, dynamic cart badge, error boundaries, and suspense loading skeletons. Every page is code-split and loaded on demand using `React.lazy()`.

| Route           | Page Component      | Description                                                     | Loading / Error Handling                   |
| :-------------- | :------------------ | :-------------------------------------------------------------- | :----------------------------------------- |
| `/`             | `HomePage`          | Catalog hero, search, filter, categories, product grid          | Suspense + ProductsSkeleton                |
| `/products/:id` | `ProductDetailPage` | Single product detail view loaded by ID from API                | Suspense + DetailSkeleton + Retry button   |
| `/cart`         | `CartPage`          | Full shopping cart view, coupon code application, order summary | Suspense + Empty Cart State                |
| `/checkout`     | `CheckoutPage`      | Zod-validated order checkout form with shipping & payment       | Suspense + Validation Error States         |
| `/orders`       | `OrdersPage`        | Order history, real-time status tracker, cancel action          | Suspense + 4-State UI (Loading/Empty/List) |
| `*`             | `NotFoundPage`      | Accessible 404 page with return-to-catalog link                 | Instant render                             |

---

## 2. Complete Component Tree & State Ownership

```text
main.tsx
└── ToastProvider (owns: toasts[], addToast, removeToast)
    └── AuthProvider (owns: currentUser, login, logout)
        └── OrdersProvider (owns: orders[], createOrder, updateOrderStatus)
            └── CartProvider (owns: cartState [items, coupon], addItem, removeItem, updateQuantity, applyCoupon, clearCart)
                └── ProductsProvider (owns: products[], category, search, sort, loading, error, refresh)
                    └── App
                        └── RouterProvider
                            └── RootLayout (owns: isStudioOpen)
                                ├── Header (props: cartCount, onOpenStudio)
                                │   ├── NavLink to="/"
                                │   ├── NavLink to="/cart"
                                │   ├── NavLink to="/orders"
                                │   └── StudioTriggerButton (props: onClick)
                                ├── ErrorBoundary (owns: hasError, error; handles resets)
                                │   └── Suspense (fallback: <PageSkeleton />)
                                │       └── Outlet (renders active route)
                                │           ├── [Route: "/"] HomePage
                                │           │   └── ProductsContainer (connects to ProductsContext)
                                │           │       ├── ProductsHero
                                │           │       ├── CategoryChips (props: categories, selectedCategory, onSelect)
                                │           │       ├── ProductsFilterBar (props: search, sort, inStockOnly, onSearchChange, onSortChange, onInStockToggle)
                                │           │       ├── ProductsSkeleton (loading state)
                                │           │       ├── ErrorCard (props: message, onRetry) (error state)
                                │           │       ├── EmptyState (props: type="empty" | "no-match") (empty state)
                                │           │       └── ProductsList (props: products)
                                │           │           └── ProductCard (props: product, onQuickView, onAddToCart)
                                │           ├── [Route: "/products/:id"] ProductDetailPage (owns: product, quantity, loading, error, isAdded)
                                │           │   ├── ProductGallery (props: image, name)
                                │           │   ├── ProductInfo (props: name, category, price, rating, reviewsCount, description)
                                │           │   ├── QuantitySelector (props: quantity, min, max, onChange)
                                │           │   └── AddToCartButton (props: onAddToCart, disabled)
                                │           ├── [Route: "/cart"] CartPage (connects to CartContext)
                                │           │   ├── CartItemsTable (props: items)
                                │           │   │   └── CartItemRow (props: item, onIncrement, onDecrement, onRemove)
                                │           │   └── CartSummaryCard (props: subtotal, shipping, discount, vat, total)
                                │           │       ├── CouponForm (owns: couponInput, error; calls applyCoupon)
                                │           │       └── CheckoutLink (to="/checkout")
                                │           ├── [Route: "/checkout"] CheckoutPage (owns: isSubmitting, orderSuccess; connects to Cart & Orders)
                                │           │   ├── CheckoutForm (owns: react-hook-form state; props: onSubmit, isSubmitting)
                                │           │   │   ├── FormField: FullName (Zod validated)
                                │           │   │   ├── FormField: Email (Zod validated)
                                │           │   │   ├── FormField: Phone (Regex ^05\d{8}$)
                                │           │   │   ├── FormField: City (Select)
                                │           │   │   ├── FormField: StreetAddress (Zod validated)
                                │           │   │   ├── FormField: PaymentMethod (Radio Group)
                                │           │   │   └── FormField: DeliveryNotes (Optional textarea)
                                │           │   └── OrderSummarySidebar (props: items, subtotal, shipping, total)
                                │           ├── [Route: "/orders"] OrdersPage (connects to OrdersContext)
                                │           │   └── OrderCard (props: order, onCancelOrder)
                                │           │       ├── OrderStatusBadge (props: status)
                                │           │       └── OrderItemsList (props: items)
                                │           └── [Route: "*"] NotFoundPage
                                ├── DeskStudioModal (props: isOpen, onClose; renders 3D Canvas via @react-three/fiber)
                                └── Footer
```

---

## 3. State Management: Why Context API?

We selected the **React Context API** with domain-sliced Providers (`CartContext`, `ProductsContext`, `OrdersContext`, `AuthContext`) over Zustand for the following architectural reasons:

1. **Native to React**: Zero external state dependencies, zero bundle overhead, and complete compatibility with React 19 concurrent features.
2. **Domain Isolation**: State is decoupled into distinct contextual boundaries. A change in the cart does not re-render products or order history.
3. **Single Source of Truth & Zero Duplication**:
   - Cart subtotal, tax, discounts, and total are **derived on the fly** via pure functions in `cart.logic.ts`.
   - The cart automatically synchronizes with `localStorage` (`shopboard_cart_v2`) and survives page reloads.
4. **Action-Driven State Mutations**:
   - Consumers only interact through strictly typed action dispatchers (`addItem`, `removeItem`, `updateQuantity(id, delta)`).
   - Direct mutation is strictly forbidden.

---

## 4. Validated Checkout (React Hook Form + Zod)

The checkout workflow at `/checkout` utilizes `react-hook-form` paired with a strict Zod schema in `src/modules/checkout/checkout.schema.ts`:

- **Full Name**: Minimum 3 characters, required.
- **Email**: Strict email format validation.
- **Saudi Phone Number**: Regex validation matching `^05\d{8}$` (10 digits starting with 05).
- **City & Street Address**: Required shipping location details.
- **Payment Method**: Discriminated selection (`card` | `apple_pay` | `cod`).
- **Accessibility**: All fields have associated `<label htmlFor="...">`, `aria-invalid`, `aria-describedby` pointing to error alerts with `role="alert"`.

---

## 5. 4-State UI & API Simulation Testing

All data-fetching screens implement the **Mandatory 4-State Lifecycle**:

1. **Loading State**: Visual skeleton placeholders via `Suspense` and `<*Skeleton />` components.
2. **Error State**: Caught by `<ErrorBoundary />` and localized error cards, featuring an actionable **"إعادة المحاولة (Try again)"** button.
3. **Empty / No-Match State**: Clearly distinguishes between an empty catalog (`no-items`) and non-matching search filters (`no-match`).
4. **Success State**: Complete interactive list with semantic keys.

### Simulating API Edge Cases

You can test the backend states directly by running with simulation paths or query parameters:

- **Delay (3 seconds)**: Append `?sim=delay/3000` to the URL.
- **Error (HTTP 500)**: Append `?sim=fail/500` to the URL.
- **Empty Catalog**: Append `?sim=empty` to the URL.

---

## 6. Verification & Quality Gates

```bash
# Typecheck (Strict TypeScript, 0 any, 0 as, 0 !)
npm run typecheck

# Lint (ESLint 9 flat config, 0 warnings)
npm run lint

# Format check (Prettier)
npm run format:check

# Unit Tests (Vitest)
npm test

# Production Build (Vite 8 chunked output)
npm run build
```

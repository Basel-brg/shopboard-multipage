# Debug lab log

This log documents the 5 planted React bugs identified in the ShopBoard Debug Lab (`https://shopboard-api.vercel.app/debug-lab`), detailing how each was diagnosed using React DevTools, its root cause, and the production-grade fix.

---

## Bug 1

- **What I saw:** A red React console warning upon loading the shop page: `Warning: Each child in a list should have a unique "key" prop. Check the render method of 'CategoryChips'.`
- **Component:** `CategoryChips` (`src/components/CategoryChips.tsx`)
- **How I found it:** Console tab warning naming `CategoryChips`.
- **Cause:** Line 8 of `CategoryChips.tsx` mapped over `categories` and returned `<span className="chip">{category}</span>` without assigning a `key` prop to each element. React requires unique keys to reconcile sibling elements efficiently during re-renders.
- **Fix:** Add a unique `key` prop using the string value of the category:
  ```tsx
  {
    categories.map((category) => (
      <span key={category} className="chip">
        {category}
      </span>
    ));
  }
  ```

---

## Bug 2

- **What I saw:** A stray `0` displayed as text on sold-out product cards (e.g., under Mini Crossbody Bag) and inside the empty cart drawer where nothing should be displayed.
- **Component:** `StockNote` (`src/components/StockNote.tsx`) & `CartPanel` (`src/components/CartPanel.tsx`)
- **How I found it:** Visual inspection of sold-out cards and the empty cart panel, confirmed via Chrome DevTools Elements tab inspecting the rendered DOM nodes.
- **Cause:**
  1. In `StockNote.tsx`: `{stock && <span>Only {stock} left</span>}`. When `stock === 0`, JavaScript evaluates `0 && <JSX>` to the falsy number `0`, which React renders as literal text `"0"`.
  2. In `CartPanel.tsx`: `{cart.length && (<ul>...</ul>)}`. When `cart` is empty, `cart.length === 0` evaluates to `0`, rendering `"0"` inside the cart drawer.
- **Fix:** Use an explicit boolean comparison with `> 0`:
  ```tsx
  // In StockNote.tsx:
  export function StockNote({ stock }: StockNoteProps) {
    return <p className="stock">{stock > 0 && <span>Only {stock} left</span>}</p>;
  }

  // In CartPanel.tsx:
  {
    cart.length > 0 && (
      <ul>
        {cart.map((item) => (
          <CartRow key={item.id} item={item} product={product} onChange={onChange} />
        ))}
      </ul>
    );
  }
  ```

---

## Bug 3

- **What I saw:** After saving (♡ ➔ ♥) the "Leather Tote Bag" and then sorting the catalog by "Price: low to high", the heart remained on the first card position (now showing "Canvas Backpack"), while the Leather Tote Bag lost its saved state.
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** React DevTools Components tab: selected `<ProductCard>` in the tree and inspected its `key` attribute (`key="0"`, `key="1"`, etc.).
- **Cause:** Line 17 in `ProductList.tsx` used the array `index` as the React key: `{shown.map((product, index) => <ProductCard key={index} ... />)}`. When the array was sorted, React matched DOM elements by key (`0`, `1`, `2`...) and preserved the local `useState(saved)` on the component at index 0 rather than moving it with the data.
- **Fix:** Use the unique, stable product ID as the key:
  ```tsx
  {
    shown.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />);
  }
  ```

---

## Bug 4

- **What I saw:** After sorting by "Price: low to high" and then choosing "Featured" again, the catalog order remained sorted by price and failed to revert to the initial featured order.
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** React DevTools Components tab: selected `<ProductList>` and inspected the `products` prop before and after sorting. The original array had been mutated in-place.
- **Cause:** Line 12 in `ProductList.tsx`:
  ```ts
  const shown = sort === 'price-asc' ? products.sort((a, b) => a.price - b.price) : products;
  ```
  `Array.prototype.sort()` mutates the source array in place. Since `products` was passed by reference from `App.tsx`, the original data array was permanently modified.
- **Fix:** Create a shallow copy before sorting, or use `toSorted()`:
  ```ts
  const shown = sort === 'price-asc' ? [...products].sort((a, b) => a.price - b.price) : products;
  ```

---

## Bug 5

- **What I saw:** Clicking the `+` button in the cart item row did not increment the displayed quantity. The quantity only changed later if another item was added to the cart.
- **Component:** `CartRow` (`src/components/CartRow.tsx`) & `App` (`src/App.tsx`)
- **How I found it:** React DevTools Components tab → ⚙ Settings → _Highlight updates when components render_. Clicking `+` caused no green highlight/re-render. Inspecting `item.qty` in DevTools showed the object was mutated, but React's state did not trigger a render cycle because `setCart(cart)` used the identical array reference (`Object.is(prev, next)` was `true`).
- **Cause:**
  1. In `CartRow.tsx`: `item.qty = item.qty + 1` directly mutated the item object in place.
  2. In `App.tsx`: `onChange={() => setCart(cart)}` passed the same array reference to state setter, causing React to bail out of re-rendering.
- **Fix:** Perform immutable state updates by passing a callback from `App`:
  ```tsx
  // In App.tsx:
  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    );
  }

  // In CartRow.tsx:
  interface CartRowProps {
    item: CartItem;
    product: Product;
    onUpdateQty: (id: number, delta: number) => void;
  }

  export function CartRow({ item, product, onUpdateQty }: CartRowProps) {
    return (
      <li className="row">
        <span>{product.name}</span>
        <span>× {item.qty}</span>
        <button type="button" onClick={() => onUpdateQty(item.id, 1)}>
          +
        </button>
      </li>
    );
  }
  ```

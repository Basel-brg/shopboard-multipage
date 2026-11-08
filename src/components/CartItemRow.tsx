import type { CartItem } from '../modules/cart/cart.types';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
  return (
    <li className="cart-item-row" data-item-id={item.id}>
      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.name}</h4>
        <span className="cart-item-price">{item.price} ر.س</span>
      </div>

      <div className="cart-qty-controls">
        <button
          type="button"
          className="qty-btn minus"
          onClick={() => onUpdateQuantity(item.id, -1)}
          aria-label={`تقليل كمية ${item.name}`}
        >
          -
        </button>
        <span className="qty-value" aria-label={`الكمية الحالية: ${item.quantity}`}>
          {item.quantity}
        </span>
        <button
          type="button"
          className="qty-btn plus"
          onClick={() => onUpdateQuantity(item.id, 1)}
          aria-label={`زيادة كمية ${item.name}`}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="remove-item-btn"
        onClick={() => onRemoveItem(item.id)}
        aria-label={`حذف ${item.name} من السلة`}
      >
        حذف
      </button>
    </li>
  );
}

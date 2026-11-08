import React from 'react';
import type { CartItem } from '../cart.types';
import { IconTrash } from '../../../shared/components/Icons/Icons';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <li className="cart-item" data-id={item.id}>
      <div className="cart-item-thumb">
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-img"
          loading="lazy"
          width="68"
          height="68"
        />
      </div>
      <div className="item-details">
        <h4 className="item-name">{item.name}</h4>
        <span className="item-price">
          {item.price} ر.س × {item.quantity} = <strong>{item.price * item.quantity} ر.س</strong>
        </span>
        <div className="quantity-controls" aria-label="التحكم بالكمية">
          <button
            type="button"
            className="qty-btn"
            data-action="decrease"
            data-id={item.id}
            aria-label={`إنقاص الكمية لمنتج ${item.name}`}
            onClick={() => onUpdateQuantity(item.id, -1)}
          >
            −
          </button>
          <span className="qty-display" aria-label="الكمية الحالية">
            {item.quantity}
          </span>
          <button
            type="button"
            className="qty-btn"
            data-action="increase"
            data-id={item.id}
            aria-label={`زيادة الكمية لمنتج ${item.name}`}
            onClick={() => onUpdateQuantity(item.id, 1)}
          >
            +
          </button>
          <button
            type="button"
            className="item-delete-btn"
            data-action="delete"
            data-id={item.id}
            aria-label={`حذف منتج ${item.name} من السلة`}
            onClick={() => onRemoveItem(item.id)}
          >
            <IconTrash size={15} />
            <span>حذف</span>
          </button>
        </div>
      </div>
    </li>
  );
};

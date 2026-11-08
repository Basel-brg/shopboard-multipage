import React from 'react';
import type { Order } from '../orders.types';
import { getOrderStatusBadge, formatOrderDate } from '../orders.logic';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onCancelOrder }) => {
  const badge = getOrderStatusBadge(order.status);
  const canCancel = order.status === 'pending' || order.status === 'processing';
  const itemCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <article className="order-card" data-order-id={order.id}>
      <header className="order-card-header">
        <div className="order-title-group">
          <span className="order-num" dir="ltr">
            #{order.orderNumber}
          </span>
          <time className="order-date">{formatOrderDate(order.createdAt)}</time>
        </div>
        <span className={`order-status-badge ${badge.className}`}>
          <span aria-hidden="true">{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      </header>

      <div className="order-card-body">
        <div className="order-items-strip">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="order-item-thumb" title={`${item.name} (${item.quantity})`}>
              <img
                src={item.image || '/assets/products/keyboard.jpg'}
                alt={item.name}
                loading="lazy"
              />
              <span className="order-thumb-qty">×{item.quantity}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <span className="order-thumb-more">+{order.items.length - 3}</span>
          )}
        </div>

        <div className="order-meta-info">
          <span className="meta-row">
            <span>المستلم:</span>{' '}
            <strong>
              {order.customerName} ({order.customerCity})
            </strong>
          </span>
          <span className="meta-row">
            <span>عدد المنتجات:</span> <strong>{itemCount} قطع</strong>
          </span>
          {order.trackingNumber && (
            <span className="meta-row meta-tracking">
              <span>رقم التتبع:</span>
              <strong dir="ltr">{order.trackingNumber}</strong>
            </span>
          )}
        </div>
      </div>

      <footer className="order-card-footer">
        <div className="order-total-block">
          <span className="total-label">المجموع الإجمالي</span>
          <strong className="total-val">{order.total} ر.س</strong>
        </div>
        <div className="order-card-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm btn-order-details"
            data-action="details"
            data-id={order.id}
            onClick={() => onViewDetails(order)}
          >
            عرض التفاصيل
          </button>
          {canCancel && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm btn-order-cancel"
              data-action="cancel"
              data-id={order.id}
              onClick={() => onCancelOrder(order.id)}
            >
              إلغاء الطلب
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};

import React from 'react';
import type { Order } from '../orders.types';
import { getOrderStatusBadge, formatOrderDate } from '../orders.logic';
import { Modal } from '../../../shared/components/Modal/Modal';
import { IconClose } from '../../../shared/components/Icons/Icons';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const badge = getOrderStatusBadge(order.status);

  return (
    <Modal
      isOpen={Boolean(order)}
      onClose={onClose}
      id="order-details-modal"
      className="modal-dialog order-details-dialog"
      aria-labelledby="order-details-title"
    >
      <div className="modal-card order-details-card">
        <header className="modal-header">
          <h3 id="order-details-title">تفاصيل الفاتورة والطلب</h3>
          <button
            type="button"
            className="icon-close-btn"
            onClick={onClose}
            aria-label="إغلاق تفاصيل الطلب"
          >
            <IconClose size={20} />
          </button>
        </header>

        <div id="order-details-body" className="order-details-content">
          <div className="order-modal-header-meta">
            <div className="modal-ref-group">
              <span className="ref-label">رقم الطلب</span>
              <h3 className="ref-number" dir="ltr">
                #{order.orderNumber}
              </h3>
              <span className="ref-date">{formatOrderDate(order.createdAt)}</span>
            </div>
            <span className={`order-status-badge ${badge.className}`}>
              {badge.icon} {badge.label}
            </span>
          </div>

          <div className="order-modal-details-grid">
            <div className="detail-box">
              <h4>بيانات المستلم والشحن</h4>
              <p>
                <strong>الاسم:</strong> {order.customerName}
              </p>
              <p>
                <strong>الهاتف:</strong> <span dir="ltr">{order.customerPhone}</span>
              </p>
              <p>
                <strong>المدينة:</strong> {order.customerCity}
              </p>
              {order.trackingNumber && (
                <p>
                  <strong>رقم الشحنة:</strong> <span dir="ltr">{order.trackingNumber}</span>
                </p>
              )}
            </div>

            <div className="detail-box">
              <h4>بيانات الدفع والملخص</h4>
              <p>
                <strong>طريقة الدفع:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>المجموع الفرعي:</strong> {order.subtotal} ر.س
              </p>
              <p>
                <strong>الخصم:</strong> {order.discount > 0 ? `-${order.discount} ر.س` : '0 ر.س'}
              </p>
              <p>
                <strong>رسوم الشحن:</strong>{' '}
                {order.shipping === 0 ? 'مجاني' : `${order.shipping} ر.س`}
              </p>
              <p className="final-total">
                <strong>المبلغ الصافي:</strong> <span>{order.total} ر.س</span>
              </p>
            </div>
          </div>

          <div className="order-modal-items">
            <h4>قائمة العناصر ({order.items.length})</h4>
            <div className="modal-items-list">
              {order.items.map((it, idx) => (
                <div key={idx} className="modal-item-row">
                  <img
                    src={it.image || '/assets/products/keyboard.jpg'}
                    alt={it.name}
                    width="54"
                    height="54"
                  />
                  <div className="modal-item-info">
                    <span className="modal-item-name">{it.name}</span>
                    <span className="modal-item-pricing">
                      {it.price} ر.س × {it.quantity} = <strong>{it.price * it.quantity} ر.س</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions-bar">
          <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </Modal>
  );
};

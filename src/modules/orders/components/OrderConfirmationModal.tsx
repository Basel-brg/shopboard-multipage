import React from 'react';
import type { Order } from '../orders.types';
import { Modal } from '../../../shared/components/Modal/Modal';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={Boolean(order)}
      onClose={onClose}
      id="order-dialog"
      className="modal-dialog order-dialog"
      aria-labelledby="order-confirm-title"
    >
      <div className="modal-card order-dialog-card">
        <h2 id="order-confirm-title">تم استلام طلبك بنجاح</h2>
        <p id="dialog-order-msg" className="dialog-message">
          شكراً لثقتك يا {order.customerName}! سيتم تجهيز وشحن طلبك إلى {order.customerCity} خلال 24
          ساعة.
        </p>
        <div className="dialog-details" id="dialog-details">
          <div className="summary-line">
            <span>رقم الطلب المرجعي:</span> <strong dir="ltr">#{order.orderNumber}</strong>
          </div>
          <div className="summary-line">
            <span>رقم التواصل:</span> <strong dir="ltr">{order.customerPhone}</strong>
          </div>
          <div className="summary-line">
            <span>طريقة الدفع:</span> <strong>{order.paymentMethod}</strong>
          </div>
          <div className="summary-line">
            <span>عدد القطع:</span>{' '}
            <strong>{order.items.reduce((sum, it) => sum + it.quantity, 0)}</strong>
          </div>
          <div className="summary-line summary-total">
            <span>المبلغ الإجمالي:</span> <strong>{order.total} ر.س</strong>
          </div>
        </div>
        <button
          type="button"
          id="dialog-close-btn"
          className="btn btn-primary btn-block btn-lg"
          onClick={onClose}
        >
          متابعة التسوق
        </button>
      </div>
    </Modal>
  );
};

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../modules/cart/context/useCart';
import { useOrders } from '../modules/orders/context/useOrders';
import type { OrderItem } from '../modules/orders/orders.types';
import { CheckoutForm } from '../modules/checkout/CheckoutForm';
import type { CheckoutFormData } from '../modules/checkout/checkout.schema';

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  async function handleCheckoutSubmit(data: CheckoutFormData) {
    setIsSubmitting(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orderItems: OrderItem[] = cartState.items.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const newOrder = createOrder({
        customerName: data.fullName,
        customerPhone: data.phone,
        customerCity: data.city,
        paymentMethod: data.paymentMethod,
        items: orderItems,
        subtotal: cartState.subtotal,
        discount: cartState.discountAmount,
        shipping: cartState.shipping,
        total: cartState.total,
        notes: data.notes,
      });

      clearCart();
      setCompletedOrderId(newOrder.orderNumber);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'تعذر إتمام الطلب، يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (completedOrderId) {
    return (
      <div className="container checkout-success-view" role="status">
        <div className="success-receipt-card">
          <span className="success-icon" aria-hidden="true">
            🎉
          </span>
          <h1 className="success-title">تم استلام طلبك بنجاح!</h1>
          <p className="order-number-text">
            رقم الطلب الخاص بك: <strong>#{completedOrderId}</strong>
          </p>
          <p className="success-details">
            تم إرسال تفاصيل الفاتورة وموعد الشحن إلى بريدك الإلكتروني. شكراً لاختيارك شوب بورد.
          </p>
          <div className="success-actions">
            <button type="button" className="view-orders-btn" onClick={() => navigate('/orders')}>
              متابعة حالة الطلب في طلباتي
            </button>
            <Link to="/" className="home-link-btn">
              العودة إلى المتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="container checkout-empty-view" role="status">
        <div className="empty-cart-card">
          <h2>سلة المشتريات فارغة</h2>
          <p>لا توجد أي منتجات للدفع. يرجى إضافة منتجات إلى السلة أولاً.</p>
          <Link to="/" className="start-shopping-btn">
            العودة للكتالوج
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-page-view">
      <header className="checkout-page-header">
        <h1 className="page-title">إتمام الشراء والدفع الآمن</h1>
        <p className="page-subtitle">أدخل تفاصيل التوصيل لاكتمال شحنتك المعتمدة.</p>
      </header>

      <div className="checkout-grid-layout">
        <div className="checkout-form-column">
          <CheckoutForm onSubmit={handleCheckoutSubmit} isSubmitting={isSubmitting} />
        </div>

        <aside className="checkout-order-summary-column">
          <div className="checkout-summary-box">
            <h3 className="box-title">ملخص مشترياتك ({cartState.count} قطع)</h3>

            <ul className="checkout-items-preview-list">
              {cartState.items.map((item) => (
                <li key={item.id} className="preview-item-row">
                  <span className="item-name-preview">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="item-price-preview">
                    {(item.price * item.quantity).toFixed(2)} ر.س
                  </span>
                </li>
              ))}
            </ul>

            <div className="summary-calculations">
              <div className="calc-row">
                <span>المجموع الفرعي:</span>
                <span>{cartState.subtotal.toFixed(2)} ر.س</span>
              </div>
              {cartState.discountAmount > 0 && (
                <div className="calc-row discount-row">
                  <span>الخصم المطبق:</span>
                  <span>-{cartState.discountAmount.toFixed(2)} ر.س</span>
                </div>
              )}
              <div className="calc-row">
                <span>رسوم الشحن:</span>
                <span>
                  {cartState.shipping === 0 ? 'مجاني' : `${cartState.shipping.toFixed(2)} ر.س`}
                </span>
              </div>
              <div className="calc-row final-total">
                <strong>المجموع الكلي:</strong>
                <strong>{cartState.total.toFixed(2)} ر.س</strong>
              </div>
            </div>

            <div className="security-badges">
              <span>🔒 دفع مشفر وآمن 100%</span>
              <span>⚡ شحن وتوصيل فوري خلال 48 ساعة</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

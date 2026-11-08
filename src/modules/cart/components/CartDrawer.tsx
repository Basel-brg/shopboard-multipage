import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useOrders } from '../../orders/context/useOrders';
import { CartItemRow } from './CartItemRow';
import { CheckoutForm } from './CheckoutForm';
import { IconClose, IconBag } from '../../../shared/components/Icons/Icons';

export const CartDrawer: React.FC = () => {
  const {
    isOpen,
    closeCart,
    state,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { createOrder } = useOrders();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const ok = applyCoupon(couponCode);
    if (ok) setCouponCode('');
  };

  const handleOrderSubmit = (formData: {
    customerName: string;
    customerPhone: string;
    customerCity: string;
    paymentMethod: string;
  }) => {
    createOrder({
      ...formData,
      items: state.items.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: state.subtotal,
      discount: state.discountAmount,
      shipping: state.shipping,
      total: state.total,
    });

    clearCart();
    closeCart();
  };

  return (
    <>
      {/* Cart Drawer Overlay Backdrop */}
      <div
        id="cart-backdrop"
        className={`cart-backdrop ${isOpen ? 'is-visible' : ''}`}
        aria-hidden="true"
        onClick={closeCart}
      />

      <aside
        id="cart-drawer"
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-labelledby="cart-drawer-title"
        aria-hidden={!isOpen}
      >
        <header className="drawer-header">
          <div className="drawer-title-wrap">
            <h2 id="cart-drawer-title">حقيبة التسوق</h2>
            <span id="drawer-items-count" className="drawer-items-count">
              {state.count} عناصر
            </span>
            <button
              type="button"
              id="cart-clear-btn"
              className="cart-clear-btn"
              aria-label="تفريغ سلة المشتريات بالكامل"
              disabled={state.items.length === 0}
              onClick={clearCart}
            >
              تفريغ السلة
            </button>
          </div>
          <button
            type="button"
            id="cart-close-btn"
            className="icon-close-btn"
            aria-label="إغلاق سلة المشتريات"
            onClick={closeCart}
          >
            <IconClose size={20} />
          </button>
        </header>

        <div className="drawer-body">
          {/* Shipping Banner */}
          <section
            className={`shipping-banner ${state.remainingForFreeShipping === 0 && state.count > 0 ? 'is-unlocked' : ''}`}
            id="shipping-banner"
            aria-label="حالة الشحن المجاني"
          >
            <p id="shipping-banner-text" className="shipping-banner-text">
              {state.remainingForFreeShipping === 0 && state.count > 0 ? (
                <>
                  <strong>تهانينا!</strong> طلبك مؤهل للحصول على شحن مجاني بالكامل.
                </>
              ) : (
                <>
                  أضف <strong>{state.remainingForFreeShipping} ر.س</strong> إضافية للحصول على{' '}
                  <strong>شحن مجاني</strong>
                </>
              )}
            </p>
            <div
              className="shipping-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              id="shipping-progressbar"
              aria-valuenow={state.shippingProgress}
            >
              <div
                id="shipping-progress-fill"
                className="shipping-progress-fill"
                style={{ width: `${state.shippingProgress}%` }}
              />
            </div>
          </section>

          {/* Empty View */}
          {state.items.length === 0 ? (
            <div id="cart-empty-view" className="cart-empty-view">
              <div className="empty-bag-illustration">
                <IconBag size={38} />
              </div>
              <p className="empty-title">حقيبة التسوق فارغة</p>
              <p className="empty-desc">
                اختر معدات مكتبك المفضلة وأضفها للسلة للاستفادة من الشحن المجاني.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <ul id="cart-items-list" className="cart-items-list" aria-label="عناصر السلة">
                {state.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </ul>

              {/* Promo Coupon Form */}
              <form
                id="coupon-form"
                className="coupon-form"
                onSubmit={handleApplyCoupon}
                noValidate
              >
                <div className="form-field">
                  <label htmlFor="coupon-code" className="field-label">
                    كود الخصم (جرّب SHOP20 أو WELCOME10):
                  </label>
                  <div className="coupon-row">
                    <input
                      type="text"
                      id="coupon-code"
                      name="coupon"
                      aria-label="كود الخصم"
                      placeholder="أدخل الكود هنا..."
                      dir="ltr"
                      autoComplete="off"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary">
                      تطبيق
                    </button>
                  </div>
                </div>

                {state.appliedCoupon && (
                  <div id="applied-coupon-tag" className="applied-coupon-tag">
                    <span id="applied-coupon-text">
                      تم تفعيل الكود {state.appliedCoupon.code} ({state.appliedCoupon.label})
                    </span>
                    <button
                      type="button"
                      id="remove-coupon-btn"
                      className="remove-coupon-btn"
                      aria-label="إلغاء كود الخصم"
                      onClick={removeCoupon}
                    >
                      إزالة
                    </button>
                  </div>
                )}
              </form>

              <div className="cart-page-link-wrap">
                <Link to="/cart" onClick={closeCart} className="view-full-cart-link">
                  عرض صفحة السلة التفصيلية ←
                </Link>
              </div>

              {/* Checkout Form */}
              <CheckoutForm cartState={state} onSubmitOrder={handleOrderSubmit} />
            </>
          )}
        </div>
      </aside>
    </>
  );
};

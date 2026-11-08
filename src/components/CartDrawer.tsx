import { useState } from 'react';
import type React from 'react';
import type { CartState } from '../modules/cart/cart.types';
import { CartItemRow } from './CartItemRow';

export interface CartDrawerProps {
  isOpen: boolean;
  cartState: CartState;
  onClose: () => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  cartState,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCart,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleCouponSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const ok = onApplyCoupon(couponCode);
    if (!ok) {
      setCouponError('رمز الكوبون غير صالح أو منتهي الصلاحية');
    } else {
      setCouponError(null);
      setCouponCode('');
    }
  }

  const hasItems = cartState.items.length > 0;

  return (
    <div className="drawer-overlay" onClick={onClose} role="presentation">
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="سلة المشتريات"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2 className="drawer-title">سلة المشتريات</h2>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="إغلاق سلة المشتريات"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {hasItems ? (
            <ul className="cart-items-list" aria-label="قائمة المنتجات المضافة">
              {cartState.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-cart-view" role="status">
              <p className="empty-cart-msg">سلة المشتريات فارغة حالياً.</p>
              <button type="button" className="continue-shopping-btn" onClick={onClose}>
                تصفح المنتجات
              </button>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="drawer-footer">
            <form className="coupon-form" onSubmit={handleCouponSubmit}>
              <div className="coupon-input-group">
                <label htmlFor="coupon-code-input" className="sr-only">
                  كود الخصم
                </label>
                <input
                  id="coupon-code-input"
                  name="couponCode"
                  type="text"
                  placeholder="أدخل كود الخصم (مثل DESK10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                  aria-label="كود الخصم"
                />
                <button type="submit" className="apply-coupon-btn">
                  تطبيق
                </button>
              </div>
              {couponError && (
                <p className="coupon-error" role="alert">
                  {couponError}
                </p>
              )}
            </form>

            {cartState.appliedCoupon && (
              <div className="applied-coupon-row">
                <span>
                  الكوبون: {cartState.appliedCoupon.code} (-{cartState.appliedCoupon.percent}%)
                </span>
                <button
                  type="button"
                  className="remove-coupon-btn"
                  onClick={onRemoveCoupon}
                  aria-label="إزالة الكوبون"
                >
                  إزالة
                </button>
              </div>
            )}

            <div className="cart-totals">
              <div className="total-row">
                <span>المجموع الفرعي:</span>
                <span>{cartState.subtotal.toFixed(2)} ر.س</span>
              </div>
              {cartState.discountAmount > 0 && (
                <div className="total-row discount-row">
                  <span>الخصم:</span>
                  <span>-{cartState.discountAmount.toFixed(2)} ر.س</span>
                </div>
              )}
              <div className="total-row">
                <span>الشحن:</span>
                <span>
                  {cartState.shipping === 0 ? 'مجاني' : `${cartState.shipping.toFixed(2)} ر.س`}
                </span>
              </div>
              <div className="total-row grand-total-row">
                <strong>المجموع الكلي:</strong>
                <strong>{cartState.total.toFixed(2)} ر.س</strong>
              </div>
            </div>

            <div className="drawer-actions">
              <button
                type="button"
                className="checkout-btn"
                onClick={() => alert('شكراً لتسوقك مع شوب بورد!')}
              >
                إتمام الطلب
              </button>
              <button type="button" className="clear-cart-btn" onClick={onClearCart}>
                تفريغ السلة
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

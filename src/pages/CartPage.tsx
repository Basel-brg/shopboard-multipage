import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../modules/cart/context/useCart';

export default function CartPage() {
  const {
    state: cartState,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  function handleCouponSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const applied = applyCoupon(couponCode);
    if (!applied) {
      setCouponError('رمز الكوبون غير صالح أو منتهي الصلاحية');
    } else {
      setCouponError(null);
      setCouponCode('');
    }
  }

  const isEmpty = cartState.items.length === 0;

  return (
    <div className="container cart-page-view">
      <header className="cart-page-header">
        <h1 className="page-title">سلة المشتريات</h1>
        <p className="page-subtitle">
          {isEmpty
            ? 'سلتك فارغة حالياً. تصفح الكتالوج لاختيار ما يناسب مساحة عملك.'
            : `لديك ${cartState.count} قطع في سلتك.`}
        </p>
      </header>

      {isEmpty ? (
        <div className="empty-cart-card" role="status">
          <span className="empty-icon" aria-hidden="true">
            🛒
          </span>
          <h3>سلة المشتريات فارغة</h3>
          <p>أضف بعض القطع المميزة من الكتالوج أو جرب تصميم مكتبك في استوديو 3D.</p>
          <Link to="/" className="start-shopping-btn">
            تصفح الكتالوج
          </Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          <div className="cart-items-table-wrap">
            <table className="cart-table" aria-label="جدول محتويات السلة">
              <thead>
                <tr>
                  <th scope="col">المنتج</th>
                  <th scope="col">السعر</th>
                  <th scope="col">الكمية</th>
                  <th scope="col">الإجمالي</th>
                  <th scope="col">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {cartState.items.map((item) => (
                  <tr key={item.id} className="cart-table-row">
                    <td className="product-cell">
                      <div className="table-item-info">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="table-item-thumb" />
                        )}
                        <div>
                          <strong className="table-item-name">{item.name}</strong>
                          <span className="table-item-cat">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="price-cell">{item.price} ر.س</td>
                    <td className="qty-cell">
                      <div className="table-qty-controls">
                        <button
                          type="button"
                          className="table-qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`تقليل كمية ${item.name}`}
                        >
                          -
                        </button>
                        <span className="table-qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="table-qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`زيادة كمية ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="total-cell">
                      <strong>{(item.price * item.quantity).toFixed(2)} ر.س</strong>
                    </td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="table-remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`حذف ${item.name} من السلة`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-actions-bar">
              <button type="button" className="clear-cart-link" onClick={clearCart}>
                تفريغ السلة بالكامل
              </button>
              <Link to="/" className="continue-shopping-link">
                ← العودة للتسوق
              </Link>
            </div>
          </div>

          <aside className="cart-summary-sidebar">
            <div className="summary-card">
              <h2 className="summary-title">ملخص الطلب</h2>

              <form className="coupon-form-page" onSubmit={handleCouponSubmit}>
                <label htmlFor="cart-page-coupon" className="coupon-label">
                  كود الخصم الترويجي
                </label>
                <div className="coupon-input-group">
                  <input
                    id="cart-page-coupon"
                    type="text"
                    placeholder="مثال: DESK10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-apply-btn">
                    تطبيق
                  </button>
                </div>
                {couponError && (
                  <p className="coupon-error-msg" role="alert">
                    {couponError}
                  </p>
                )}
              </form>

              {cartState.appliedCoupon && (
                <div className="active-coupon-badge">
                  <span>
                    ✓ كود فعال: {cartState.appliedCoupon.code} (-{cartState.appliedCoupon.percent}%)
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="إزالة كود الخصم"
                    className="remove-coupon-x"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>المجموع الفرعي:</span>
                  <span>{cartState.subtotal.toFixed(2)} ر.س</span>
                </div>

                {cartState.discountAmount > 0 && (
                  <div className="summary-row discount-row">
                    <span>قيمة الخصم:</span>
                    <span>-{cartState.discountAmount.toFixed(2)} ر.س</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>الشحن:</span>
                  <span>
                    {cartState.shipping === 0 ? 'مجاني' : `${cartState.shipping.toFixed(2)} ر.س`}
                  </span>
                </div>

                <div className="summary-row grand-total">
                  <strong>المجموع الكلي:</strong>
                  <strong className="grand-price">{cartState.total.toFixed(2)} ر.س</strong>
                </div>
              </div>

              <Link to="/checkout" className="proceed-to-checkout-btn">
                المتابعة لإتمام الدفع ←
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

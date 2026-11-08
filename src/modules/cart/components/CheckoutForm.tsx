import React, { useState } from 'react';
import type { CartState } from '../cart.types';
import { validateInput } from '../../../shared/validation/validation';

interface CheckoutFormProps {
  cartState: CartState;
  onSubmitOrder: (formData: {
    customerName: string;
    customerPhone: string;
    customerCity: string;
    paymentMethod: string;
  }) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartState, onSubmitOrder }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameErr = validateInput('name', name);
    if (nameErr) newErrors.name = nameErr;

    const phoneErr = validateInput('phone', phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const cityErr = validateInput('city', city);
    if (cityErr) newErrors.city = cityErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitOrder({
      customerName: name,
      customerPhone: phone,
      customerCity: city,
      paymentMethod,
    });
  };

  return (
    <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h3 className="checkout-title">بيانات التوصيل والدفع</h3>

      <div className="form-field">
        <label htmlFor="customer-name" className="field-label">
          الاسم الثلاثي:
        </label>
        <input
          type="text"
          id="customer-name"
          name="name"
          autoComplete="name"
          required
          placeholder="مثال: خالد العتيبي"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          className={errors.name ? 'has-error' : ''}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'customer-name-error' : undefined}
        />
        {errors.name && (
          <span className="field-error" id="customer-name-error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="customer-phone" className="field-label">
          رقم الجوال للتواصل:
        </label>
        <input
          type="tel"
          id="customer-phone"
          name="phone"
          autoComplete="tel"
          required
          placeholder="05XXXXXXXX"
          dir="ltr"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
          }}
          className={errors.phone ? 'has-error' : ''}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'customer-phone-error' : undefined}
        />
        {errors.phone && (
          <span className="field-error" id="customer-phone-error" role="alert">
            {errors.phone}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="customer-city" className="field-label">
          المدينة والعنوان التفصيلي:
        </label>
        <input
          type="text"
          id="customer-city"
          name="city"
          autoComplete="street-address"
          required
          placeholder="الرياض، حي العليا، شارع التحلية"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
          }}
          className={errors.city ? 'has-error' : ''}
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? 'customer-city-error' : undefined}
        />
        {errors.city && (
          <span className="field-error" id="customer-city-error" role="alert">
            {errors.city}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="payment-method" className="field-label">
          وسيلة الدفع المفضلة:
        </label>
        <select
          id="payment-method"
          name="payment"
          aria-label="وسيلة الدفع المفضلة"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cod">الدفع عند الاستلام</option>
          <option value="card">بطاقة مدى / بطاقة ائتمانية</option>
          <option value="applepay">Apple Pay</option>
        </select>
      </div>

      <dl className="order-summary">
        <div className="summary-line">
          <dt>المجموع الفرعي</dt>
          <dd id="summary-subtotal">{cartState.subtotal} ر.س</dd>
        </div>
        {cartState.discountAmount > 0 && (
          <div className="summary-line summary-discount" id="summary-discount-row">
            <dt>قيمة الخصم</dt>
            <dd id="summary-discount">-{cartState.discountAmount} ر.س</dd>
          </div>
        )}
        <div className="summary-line">
          <dt>رسوم التوصيل</dt>
          <dd id="summary-shipping">
            {cartState.shipping === 0 ? 'مجاني' : `${cartState.shipping} ر.س`}
          </dd>
        </div>
        <div className="summary-line summary-total">
          <dt>الإجمالي المستحق</dt>
          <dd>
            <strong id="summary-total">{cartState.total} ر.س</strong>
          </dd>
        </div>
      </dl>

      <button type="submit" id="checkout-submit-btn" className="btn btn-primary btn-block btn-lg">
        تأكيد وإتمام الطلب
      </button>
    </form>
  );
};

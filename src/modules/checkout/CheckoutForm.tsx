import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from './checkout.schema';
import type { CheckoutFormData } from './checkout.schema';

export interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting = false }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      city: 'الرياض',
      streetAddress: '',
      paymentMethod: 'card',
      notes: '',
    },
  });

  return (
    <form className="checkout-form-validated" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-section">
        <h3 className="section-title">بيانات الشحن والتوصيل</h3>

        <div className="form-group">
          <label htmlFor="checkout-full-name" className="field-label">
            الاسم الكامل <span className="req">*</span>
          </label>
          <input
            id="checkout-full-name"
            type="text"
            className={`field-input ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="مثال: محمد بن فهد"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'error-fullName' : undefined}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p id="error-fullName" className="field-error" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkout-email" className="field-label">
              البريد الإلكتروني <span className="req">*</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              className={`field-input ${errors.email ? 'is-invalid' : ''}`}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'error-email' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="error-email" className="field-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-phone" className="field-label">
              رقم الجوال <span className="req">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              className={`field-input ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="05XXXXXXXX"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'error-phone' : undefined}
              {...register('phone')}
            />
            {errors.phone && (
              <p id="error-phone" className="field-error" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkout-city" className="field-label">
              المدينة <span className="req">*</span>
            </label>
            <select
              id="checkout-city"
              className={`field-select ${errors.city ? 'is-invalid' : ''}`}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'error-city' : undefined}
              {...register('city')}
            >
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
              <option value="مكة المكرمة">مكة المكرمة</option>
              <option value="المدينة المنورة">المدينة المنورة</option>
              <option value="الخبر">الخبر</option>
            </select>
            {errors.city && (
              <p id="error-city" className="field-error" role="alert">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="form-group flex-2">
            <label htmlFor="checkout-street" className="field-label">
              العنوان الوطني / اسم الشارع والحي <span className="req">*</span>
            </label>
            <input
              id="checkout-street"
              type="text"
              className={`field-input ${errors.streetAddress ? 'is-invalid' : ''}`}
              placeholder="مثال: حي النخيل، طريق الملك فهد"
              autoComplete="street-address"
              aria-invalid={!!errors.streetAddress}
              aria-describedby={errors.streetAddress ? 'error-streetAddress' : undefined}
              {...register('streetAddress')}
            />
            {errors.streetAddress && (
              <p id="error-streetAddress" className="field-error" role="alert">
                {errors.streetAddress.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">وسيلة الدفع</h3>
        <div className="payment-options-grid" role="radiogroup" aria-label="اختر وسيلة الدفع">
          <label className="payment-radio-card">
            <input type="radio" value="card" {...register('paymentMethod')} />
            <div className="radio-content">
              <strong>بطاقة مدى / ائتمانية</strong>
              <span>دفع إلكتروني آمن ومباشر</span>
            </div>
          </label>

          <label className="payment-radio-card">
            <input type="radio" value="apple_pay" {...register('paymentMethod')} />
            <div className="radio-content">
              <strong>Apple Pay</strong>
              <span>دفع فوري بلمسة واحدة</span>
            </div>
          </label>

          <label className="payment-radio-card">
            <input type="radio" value="cod" {...register('paymentMethod')} />
            <div className="radio-content">
              <strong>الدفع عند الاستلام</strong>
              <span>سداد نقدي عند وصول الشحنة</span>
            </div>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="field-error" role="alert">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="checkout-notes" className="field-label">
          ملاحظات التوصيل (اختياري)
        </label>
        <textarea
          id="checkout-notes"
          className="field-textarea"
          rows={3}
          placeholder="أي تعليمات إضافية للمندوب (مثل: يرجى الاتصال قبل الوصول)..."
          {...register('notes')}
        />
      </div>

      <button
        type="submit"
        className="submit-checkout-btn"
        disabled={isSubmitting}
        aria-label="تأكيد وإتمام الطلب"
      >
        {isSubmitting ? 'جاري معالجة الطلب...' : 'تأكيد وإتمام الطلب'}
      </button>
    </form>
  );
}

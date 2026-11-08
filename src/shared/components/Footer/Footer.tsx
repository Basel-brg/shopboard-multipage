import React, { useState } from 'react';
import { useToast } from '../Toast/ToastContext';
import { validateInput } from '../../validation/validation';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateInput('email', email);
    if (err) {
      setEmailError(err);
      return;
    }

    setEmailError('');
    showToast('تم اشتراكك بنجاح! استخدم الكود WELCOME10 لخصم 10%');
    setEmail('');
  };

  return (
    <footer className="store-footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div
            className="r-sidebar-brand"
            style={{ position: 'static', justifyContent: 'flex-start' }}
          >
            <span className="vermilion-seal" aria-hidden="true">
              شوب
              <br />
              بورد
            </span>
            <div className="brand-titles">
              <span className="brand-en">ShopBoard</span>
              <span className="brand-ar">شوب بورد</span>
            </div>
          </div>
          <p className="footer-text">
            متجر متخصص في الأجهزة التقنية الاحترافية ومعدات المكتب المختارة بعناية، مستوحى من حرفية
            ورق الواشي ودفء خشب البلوط والنحاس.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">أقسام الأتيليه</h3>
          <ul className="footer-links">
            <li>
              <a
                href="#products-section"
                data-footer-cat="الكل"
                onClick={() => onSelectCategory?.('الكل')}
              >
                جميع معدات المكتب
              </a>
            </li>
            <li>
              <a
                href="#products-section"
                data-footer-cat="لوحات مفاتيح"
                onClick={() => onSelectCategory?.('لوحات مفاتيح')}
              >
                لوحات المفاتيح الميكانيكية
              </a>
            </li>
            <li>
              <a
                href="#products-section"
                data-footer-cat="صوتيات المكتب"
                onClick={() => onSelectCategory?.('صوتيات المكتب')}
              >
                صوتيات الاستوديو
              </a>
            </li>
            <li>
              <a
                href="#products-section"
                data-footer-cat="إضاءة المكتب"
                onClick={() => onSelectCategory?.('إضاءة المكتب')}
              >
                إضاءة المكتب المعمارية
              </a>
            </li>
            <li>
              <a
                href="#products-section"
                data-footer-cat="تنظيم المكتب"
                onClick={() => onSelectCategory?.('تنظيم المكتب')}
              >
                أدوات تنظيم المكتب
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">النشرة البريدية</h3>
          <p className="footer-text">
            اشترك الآن واحصل على كود خصم ترحيبي بقيمة 10% على تجهيز مكتبك الأول.
          </p>
          <form
            className="newsletter-form"
            id="newsletter-form"
            onSubmit={handleNewsletterSubmit}
            noValidate
          >
            <div className="form-field">
              <label htmlFor="newsletter-email" className="field-label">
                البريد الإلكتروني:
              </label>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  aria-label="البريد الإلكتروني للاشتراك في النشرة"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  dir="ltr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={emailError ? 'has-error' : ''}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'newsletter-email-error' : undefined}
                />
                <button type="submit" className="btn btn-primary">
                  اشتراك
                </button>
              </div>
              {emailError && (
                <span className="field-error" id="newsletter-email-error" role="alert">
                  {emailError}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© 2026 ShopBoard (شوب بورد). جميع الحقوق محفوظة.</p>
        <p className="footer-meta">الأسعار شاملة ضريبة القيمة المضافة • ضمان سنتين</p>
      </div>
    </footer>
  );
};

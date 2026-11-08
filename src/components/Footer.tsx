export interface FooterProps {
  copyrightYear?: number;
}

export function Footer({ copyrightYear = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="enso-mark">◎</span>
            <strong>شوب بورد (ShopBoard)</strong>
          </div>
          <p className="footer-tagline">
            أتيليه رقمي متخصص في تجهيزات ومعدات المكاتب المعمارية الفاخرة.
          </p>
        </div>

        <div className="footer-col newsletter-col">
          <h4 className="footer-heading">النشرة الدورية</h4>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email-input" className="sr-only">
              البريد الإلكتروني للاشتراك
            </label>
            <input
              id="newsletter-email-input"
              name="newsletterEmail"
              type="email"
              placeholder="أدخل بريدك الإلكتروني..."
              className="newsletter-input"
              aria-label="البريد الإلكتروني للاشتراك في النشرة"
              autoComplete="email"
            />
            <button type="submit" className="newsletter-btn">
              اشتراك
            </button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {copyrightYear} شوب بورد (ShopBoard). جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

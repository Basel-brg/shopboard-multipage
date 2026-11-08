import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container not-found-page-view" role="status">
      <div className="not-found-card">
        <span className="error-code-badge">404</span>
        <h1 className="not-found-title">الصفحة المطلوبة غير موجودة</h1>
        <p className="not-found-desc">
          يبدو أنك وصلت إلى رابط غير متاح أو تم تغييره. يمكنك العودة إلى الصفحة الرئيسية لتصفح
          الكتالوج.
        </p>
        <Link to="/" className="return-home-btn">
          العودة للرئيسية ←
        </Link>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton-container" aria-busy="true" aria-label="جاري تحميل الصفحة...">
      <div className="skeleton-hero-banner" />
      <div className="container skeleton-body-grid">
        <div className="skeleton-sidebar" />
        <div className="skeleton-content-area">
          <div className="skeleton-bar" />
          <div className="skeleton-cards-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card-item">
                <div className="skeleton-thumb-rect" />
                <div className="skeleton-text-line" />
                <div className="skeleton-text-line short" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

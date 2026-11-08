import React from 'react';

export const ProductsSkeleton: React.FC = () => {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="جاري تحميل المنتجات">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-media shimmer" />
          <div className="skeleton-body">
            <div className="skeleton-line shimmer" style={{ width: '40%' }} />
            <div className="skeleton-line shimmer" style={{ width: '85%', height: '1.2rem' }} />
            <div className="skeleton-line shimmer" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

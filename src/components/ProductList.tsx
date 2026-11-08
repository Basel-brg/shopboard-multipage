import type { Product, LoadState } from '../modules/products/products.types';
import { ProductCard } from './ProductCard';

export interface ProductListProps {
  products: Product[];
  loadState: LoadState;
  onAddToCart: (product: Product) => void;
  onRetry: () => void;
}

export function ProductList({ products, loadState, onAddToCart, onRetry }: ProductListProps) {
  if (loadState.status === 'loading') {
    return (
      <div className="products-grid loading-grid" aria-busy="true" aria-label="جاري تحميل المنتجات">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="product-skeleton-card" aria-hidden="true">
            <div className="skeleton-thumb" />
            <div className="skeleton-line title-line" />
            <div className="skeleton-line price-line" />
            <div className="skeleton-btn" />
          </div>
        ))}
      </div>
    );
  }

  if (loadState.status === 'error') {
    return (
      <div className="error-banner" role="alert">
        <p className="error-msg">{loadState.message}</p>
        <button
          type="button"
          className="try-again-btn"
          onClick={onRetry}
          aria-label="إعادة محاولة جلب المنتجات"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (loadState.status === 'empty') {
    const isNoMatch = loadState.reason === 'no-match';
    return (
      <div className="empty-catalog-state" role="status">
        <h3 className="empty-title">
          {isNoMatch ? 'لا توجد نتائج تطابق بحثك' : 'الكتالوج فارغ حالياً'}
        </h3>
        <p className="empty-desc">
          {isNoMatch
            ? 'جرب البحث بكلمات مختلفة أو زيادة الحد الأقصى للسعر.'
            : 'لم يتم العثور على أي منتجات في قاعدة البيانات.'}
        </p>
      </div>
    );
  }

  // Success state: Always use real product.id as key, never the array index!
  return (
    <div className="products-grid" role="region" aria-label="قائمة المنتجات">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

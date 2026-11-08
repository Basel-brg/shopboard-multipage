import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../modules/products/products.types';
import { fetchProductById } from '../modules/products/products.api';
import { useCart } from '../modules/cart/context/useCart';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const productId = Number(id);

    async function loadProduct() {
      if (Number.isNaN(productId)) {
        setError('معرّف المنتج غير صالح.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const found = await fetchProductById(productId);
        if (isMounted) {
          if (found) {
            setProduct(found);
          } else {
            setError('عذراً، لم يتم العثور على هذا المنتج في المتجر.');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'تعذر تحميل بيانات المنتج من الخادم.');
          setLoading(false);
        }
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container product-detail-loading" aria-busy="true">
        <div className="detail-skeleton-grid">
          <div className="detail-skeleton-image" />
          <div className="detail-skeleton-info">
            <div className="skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton-line" style={{ width: '80%', height: '32px' }} />
            <div className="skeleton-line" style={{ width: '30%', height: '24px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '80px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container product-detail-error" role="alert">
        <div className="error-card">
          <h2>تعذر العثور على المنتج</h2>
          <p>{error || 'المنتج المطلوب غير متاح أو تم نقله.'}</p>
          <div
            className="error-actions"
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchProductById(Number(id))
                  .then((found) => {
                    if (found) setProduct(found);
                    else setError('عذراً، لم يتم العثور على هذا المنتج في المتجر.');
                  })
                  .catch((err) =>
                    setError(err instanceof Error ? err.message : 'تعذر تحميل بيانات المنتج.'),
                  )
                  .finally(() => setLoading(false));
              }}
            >
              إعادة المحاولة
            </button>
            <Link to="/" className="back-to-shop-btn">
              العودة إلى الكتالوج
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  const isOutOfStock = product.inStock === false || product.stock === 0;

  return (
    <div className="container product-detail-page">
      <nav className="breadcrumbs" aria-label="مسار التنقل">
        <Link to="/">الرئيسية</Link>
        <span aria-hidden="true">/</span>
        <Link to="/">{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product-detail-layout">
        <div className="product-gallery">
          <div className="main-image-wrap">
            <img
              src={product.image || '/assets/products/keyboard.jpg'}
              alt={product.name}
              className="detail-hero-img"
            />
            {product.tag && <span className="detail-badge">{product.tag}</span>}
          </div>
        </div>

        <div className="product-summary">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          {product.subtitle && <p className="detail-subtitle">{product.subtitle}</p>}

          <div className="detail-pricing">
            <span className="detail-price">{product.price} ر.س</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="detail-original-price">{product.originalPrice} ر.س</span>
            )}
            <span className="stock-status-badge in-stock">
              {isOutOfStock ? 'نفد المخزون' : 'متوفر للشحن الفوري'}
            </span>
          </div>

          <p className="detail-description">{product.description}</p>

          {product.specs && product.specs.length > 0 && (
            <div className="detail-specs-box">
              <h3>المواصفات التقنية:</h3>
              <ul>
                {product.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="detail-actions">
            <div className="quantity-selector">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="تقليل الكمية"
              >
                -
              </button>
              <span className="qty-num">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`primary-add-btn ${isAdded ? 'is-success' : ''}`}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isAdded ? '✓ تمت الإضافة بنجاح' : isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}
            </button>
          </div>

          <div className="detail-guarantee">
            <span>🛡️ {product.warranty || 'ضمان سنتين شامل ضد عيوب الصناعة'}</span>
            <span>🚚 شحن سريع وآمن إلى جميع مناطق المملكة</span>
          </div>
        </div>
      </div>
    </div>
  );
}

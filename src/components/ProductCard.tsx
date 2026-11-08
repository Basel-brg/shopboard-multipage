import { useState } from 'react';
import type { Product } from '../modules/products/products.types';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const isOutOfStock = product.inStock === false || product.stock === 0;

  return (
    <article className="product-card" data-product-id={product.id}>
      <div className="card-media">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="placeholder-artwork" aria-hidden="true">
            {product.name.charAt(0)}
          </div>
        )}

        <button
          type="button"
          className={`favorite-btn ${isSaved ? 'is-favorited' : ''}`}
          onClick={() => setIsSaved(!isSaved)}
          aria-pressed={isSaved}
          aria-label={
            isSaved ? `إزالة ${product.name} من المفضلة` : `حفظ ${product.name} في المفضلة`
          }
        >
          {isSaved ? '♥' : '♡'}
        </button>

        {product.tag && <span className="product-tag">{product.tag}</span>}
      </div>

      <div className="card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        {product.description && <p className="product-desc">{product.description}</p>}

        <div className="card-footer">
          <div className="price-stack">
            <span className="current-price">{product.price} ر.س</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{product.originalPrice} ر.س</span>
            )}
          </div>

          <button
            type="button"
            className="add-to-cart-btn"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            aria-label={
              isOutOfStock ? `${product.name} غير متوفر` : `إضافة ${product.name} إلى السلة`
            }
          >
            {isOutOfStock ? 'نفد المخزون' : 'أضف للسلة'}
          </button>
        </div>
      </div>
    </article>
  );
}

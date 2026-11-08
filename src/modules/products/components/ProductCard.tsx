import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../products.types';
import { getDiscountPercent } from '../products.logic';
import { IconStar, IconPlus } from '../../../shared/components/Icons/Icons';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onAddToCart }) => {
  const discountPct = getDiscountPercent(product.price, product.originalPrice);

  return (
    <article className="product-card" data-id={product.id}>
      <figure className="product-media">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          width="400"
          height="300"
        />

        <div className="product-badges">
          {product.tag && <span className="badge-editorial">{product.tag}</span>}
          {discountPct > 0 && <span className="badge-discount">خصم {discountPct}%</span>}
        </div>

        <button
          type="button"
          className="quick-view-trigger"
          data-quick-id={product.id}
          onClick={() => onQuickView(product)}
          aria-label={`معاينة تفاصيل ${product.name}`}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>معاينة</span>
        </button>
      </figure>

      {product.isFromApi && (
        <div className="product-api-notice">
          <span className="api-pulse-indicator" aria-hidden="true" />
          <span className="api-notice-text">قادم من الـ API</span>
        </div>
      )}

      <div className="product-body">
        <div className="product-meta-row">
          <span className="product-cat">{product.category}</span>
          <div className="product-rating" aria-label={`التقييم ${product.rating} من 5`}>
            <span className="star-svg">
              <IconStar size={14} />
            </span>
            <strong>{product.rating}</strong>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="product-name">
          <Link to={`/products/${product.id}`} className="product-name-link">
            {product.name}
          </Link>
        </h3>
        <p className="product-desc">{product.description}</p>

        {product.specs && product.specs.length > 0 && (
          <ul className="product-specs" aria-label="أبرز المواصفات">
            {product.specs.slice(0, 2).map((spec, idx) => (
              <li key={idx}>{spec}</li>
            ))}
          </ul>
        )}

        <div className="product-price-row">
          <div className="product-price">
            <div className="price-current">
              <span className="amount">{product.price}</span>
              <span className="currency">ر.س</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <s className="original-price">{product.originalPrice} ر.س</s>
            )}
          </div>

          <button
            type="button"
            className="btn btn-add-cart"
            data-add-id={product.id}
            onClick={() => onAddToCart(product)}
            aria-label={`أضف ${product.name} إلى السلة`}
          >
            <IconPlus size={16} />
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </article>
  );
};

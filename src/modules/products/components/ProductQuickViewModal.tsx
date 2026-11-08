import React from 'react';
import type { Product } from '../products.types';
import { getDiscountPercent } from '../products.logic';
import { Modal } from '../../../shared/components/Modal/Modal';
import { IconClose, IconStar, IconPlus } from '../../../shared/components/Icons/Icons';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const discountPct = getDiscountPercent(product.price, product.originalPrice);

  return (
    <Modal
      isOpen={Boolean(product)}
      onClose={onClose}
      id="product-dialog"
      className="modal-dialog product-dialog"
      aria-labelledby="quick-view-title"
    >
      <div className="modal-card product-modal-card" id="product-modal-body">
        <header className="dialog-header">
          <div>
            <h2 id="quick-view-title">{product.name}</h2>
            <p className="catalog-subtitle">
              {product.category} • كود المنتج {product.sku}
            </p>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            id="quick-view-close"
            onClick={onClose}
            aria-label="إغلاق المعاينة"
          >
            <IconClose size={20} />
          </button>
        </header>

        <div className="quick-view-layout">
          <figure className="quick-view-media">
            <img src={product.image} alt={product.name} />
          </figure>

          <div className="quick-view-details">
            <div className="product-rating" style={{ marginBottom: '0.75rem' }}>
              <span className="star-svg">
                <IconStar size={14} />
              </span>
              <strong>{product.rating}</strong>
              <span className="rating-count">({product.reviewsCount} تقييم موثق)</span>
            </div>

            <p className="quick-desc">{product.description}</p>

            {product.specs && product.specs.length > 0 && (
              <div className="quick-specs-block">
                <h4>المواصفات الفنية:</h4>
                <ul className="product-specs">
                  {product.specs.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.warranty && (
              <p className="quick-warranty">
                <span aria-hidden="true">🛡️</span> {product.warranty}
              </p>
            )}

            <div className="quick-price-action">
              <div className="product-price">
                <div className="price-current">
                  <span className="amount">{product.price}</span>
                  <span className="currency">ر.س</span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <s className="original-price">{product.originalPrice} ر.س</s>
                )}
                {discountPct > 0 && <span className="badge-discount">وفر {discountPct}%</span>}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                <IconPlus size={18} />
                <span>أضف إلى حقيبة التسوق</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import type { Product } from '../products.types';
import { PRODUCTS } from '../products.api';
import {
  IconHome,
  IconStore,
  IconBox3D,
  IconOrders,
  IconSettings,
  IconCart,
} from '../../../shared/components/Icons/Icons';

interface ProductsHeroProps {
  onOpenDeskStudio: () => void;
  onOpenOrders: () => void;
  onOpenAuth: () => void;
  onToggleCart: () => void;
  cartCount: number;
  cartTotal: number;
  userName?: string;
  onAddToCart: (product: Product) => void;
}

export const ProductsHero: React.FC<ProductsHeroProps> = ({
  onOpenDeskStudio,
  onOpenOrders,
  onOpenAuth,
  onToggleCart,
  cartCount,
  cartTotal,
  userName,
  onAddToCart,
}) => {
  const p1 = PRODUCTS[0];
  const p2 = PRODUCTS[1];
  const p3 = PRODUCTS[2];
  const p4 = PRODUCTS[3];

  return (
    <section id="hero-stage" className="comp-frame" aria-labelledby="hero-title">
      {/* Right Bamboo Sidebar Rail Surface */}
      <aside className="sidebar-rail-bg" aria-label="شريط الأتيليه الجانبي" />
      <div className="hero-stage-divider" aria-hidden="true" />

      {/* 4 Bordered Catalog Card Frames in First Viewport */}
      <div className="comp-card-frame comp-card-frame-1" aria-hidden="true" />
      <div className="comp-card-frame comp-card-frame-2" aria-hidden="true" />
      <div className="comp-card-frame comp-card-frame-3" aria-hidden="true" />
      <div className="comp-card-frame comp-card-frame-4" aria-hidden="true" />

      {/* 1. hero-desk-photo */}
      <figure className="r-hero-desk-photo region plate" data-region="hero-desk-photo">
        <img
          src="/assets/plates/hero-desk-photo.png"
          alt="ركن عمل احترافي من خشب البلوط مع لوحة مفاتيح ميكانيكية وسماعة استوديو وفانوس أكاري"
        />
      </figure>

      {/* 2. hero-headline */}
      <header className="r-hero-headline region text" data-region="hero-headline">
        <h1 id="hero-title">ارتقِ بمساحة عملك</h1>
        <p className="hero-subline">معدات مكتب احترافية تجمع بين الدقة والأناقة</p>
      </header>

      {/* 3. hero-subhead */}
      <div className="r-hero-subhead region text" data-region="hero-subhead" aria-hidden="true">
        <span>معدات مكتب احترافية</span>
      </div>

      {/* 4. hero-cta-primary */}
      <div className="r-hero-cta-primary region control" data-region="hero-cta-primary">
        <a href="#products-section" className="cta-pill-primary">
          <span aria-hidden="true">←</span>
          <span>استكشف المجموعة</span>
        </a>
      </div>

      {/* 5. hero-cta-secondary */}
      <div className="r-hero-cta-secondary region control" data-region="hero-cta-secondary">
        <button
          type="button"
          id="hero-filter-electronics"
          className="cta-pill-secondary"
          onClick={onOpenDeskStudio}
        >
          تكوين المكتب
        </button>
      </div>

      {/* 6. hero-badges */}
      <div className="r-hero-badges region text" data-region="hero-badges">
        <div className="hero-badges-strip">
          <div className="hero-badge-col">
            <span className="hero-badge-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12.2l2.3 2.3 4.8-4.8" />
              </svg>
            </span>
            <span className="hero-badge-text">
              تصميم هندسي
              <br />
              لمساحة العمل
            </span>
          </div>
          <div className="hero-badge-col">
            <span className="hero-badge-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <circle cx="9" cy="7" r="2" fill="#f2eada" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <circle cx="15" cy="12" r="2" fill="#f2eada" />
                <line x1="4" y1="17" x2="20" y2="17" />
                <circle cx="11" cy="17" r="2" fill="#f2eada" />
              </svg>
            </span>
            <span className="hero-badge-text">
              معايرة صوتية
              <br />
              وميكانيكية
            </span>
          </div>
          <div className="hero-badge-col">
            <span className="hero-badge-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="9" r="5.5" />
                <path d="M9.2 13.8L8 21l4-2.2L16 21l-1.2-7.2" />
              </svg>
            </span>
            <span className="hero-badge-text">
              ضمان شامل
              <br />
              لمدة سنتين
            </span>
          </div>
        </div>
      </div>

      {/* 7. sidebar-brand */}
      <div className="r-sidebar-brand region text" data-region="sidebar-brand">
        <div className="brand-titles">
          <span className="brand-en">ShopBoard</span>
          <span className="brand-ar">شوب بورد</span>
        </div>
        <span className="vermilion-seal" aria-hidden="true">
          شوب
          <br />
          بورد
        </span>
      </div>

      {/* 8. sidebar-nav */}
      <nav
        className="r-sidebar-nav region control"
        data-region="sidebar-nav"
        aria-label="التنقل الرئيسي"
      >
        <ul className="rail-nav-list">
          <li>
            <a href="#hero-stage" className="rail-nav-btn">
              <span>الرئيسية</span>
              <span className="rail-nav-icon">
                <IconHome />
              </span>
            </a>
          </li>
          <li>
            <a href="#products-section" className="rail-nav-btn">
              <span>المتجر</span>
              <span className="rail-nav-icon">
                <IconStore />
              </span>
            </a>
          </li>
          <li>
            <button
              type="button"
              id="btn-open-desk-builder"
              className="rail-nav-btn"
              aria-label="تكوين مساحة العمل 3D"
              onClick={onOpenDeskStudio}
            >
              <span>تكوين مكتب</span>
              <span className="rail-nav-icon">
                <IconBox3D />
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              id="orders-toggle-btn"
              className="rail-nav-btn"
              aria-label="سجل طلباتي"
              onClick={onOpenOrders}
            >
              <span>طلباتي</span>
              <span className="rail-nav-icon">
                <IconOrders />
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              id="auth-toggle-btn"
              className="rail-nav-btn"
              aria-label="الإعدادات وتسجيل الدخول"
              onClick={onOpenAuth}
            >
              <span id="auth-btn-label">{userName ? userName : 'الإعدادات'}</span>
              <span className="rail-nav-icon">
                <IconSettings />
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              id="cart-toggle-btn"
              className="rail-nav-btn"
              aria-label="سلة المشتريات"
              aria-expanded="false"
              aria-controls="cart-drawer"
              onClick={onToggleCart}
            >
              <span>السلة</span>
              <span id="cart-badge" className="rail-cart-badge" aria-live="polite">
                {cartCount}
              </span>
              <span id="header-cart-total" className="sr-only">
                {cartTotal} ر.س
              </span>
              <span className="rail-nav-icon">
                <IconCart />
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* 9. enso-mark */}
      <figure className="r-enso-mark region plate" data-region="enso-mark">
        <img src="/assets/plates/enso-mark.png" alt="شعار حلقة إنسو الحبرية" />
      </figure>

      {/* 12 & 13. card-1-photo & card-1-meta */}
      <figure className="r-card-1-photo region plate" data-region="card-1-photo">
        <img src={p1.image} alt={p1.name} />
      </figure>
      <div className="r-card-1-meta region control" data-region="card-1-meta">
        <div>
          <p className="comp-card-title">{p1.name}</p>
          <p className="comp-card-sub">{p1.subtitle}</p>
        </div>
        <div className="comp-card-foot">
          <span className="comp-card-price" aria-label={`${p1.price} ريال سعودي`}>
            {p1.price} ر.س
          </span>
          <button
            type="button"
            className="comp-card-btn"
            data-hero-add="1"
            onClick={() => onAddToCart(p1)}
          >
            أضف للسلة
          </button>
        </div>
      </div>

      {/* 14 & 15. card-2-photo & card-2-meta */}
      <figure className="r-card-2-photo region plate" data-region="card-2-photo">
        <img src={p2.image} alt={p2.name} />
      </figure>
      <div className="r-card-2-meta region control" data-region="card-2-meta">
        <div>
          <p className="comp-card-title">{p2.name}</p>
          <p className="comp-card-sub">{p2.subtitle}</p>
        </div>
        <div className="comp-card-foot">
          <span className="comp-card-price" aria-label={`${p2.price} ريال سعودي`}>
            {p2.price} ر.س
          </span>
          <button
            type="button"
            className="comp-card-btn"
            data-hero-add="2"
            onClick={() => onAddToCart(p2)}
          >
            أضف للسلة
          </button>
        </div>
      </div>

      {/* 16 & 17. card-3-photo & card-3-meta */}
      <figure className="r-card-3-photo region plate" data-region="card-3-photo">
        <img src={p3.image} alt={p3.name} />
      </figure>
      <div className="r-card-3-meta region control" data-region="card-3-meta">
        <div>
          <p className="comp-card-title">{p3.name}</p>
          <p className="comp-card-sub">{p3.subtitle}</p>
        </div>
        <div className="comp-card-foot">
          <span className="comp-card-price" aria-label={`${p3.price} ريال سعودي`}>
            {p3.price} ر.س
          </span>
          <button
            type="button"
            className="comp-card-btn"
            data-hero-add="3"
            onClick={() => onAddToCart(p3)}
          >
            أضف للسلة
          </button>
        </div>
      </div>

      {/* 18 & 19. card-4-photo & card-4-meta */}
      <figure className="r-card-4-photo region plate" data-region="card-4-photo">
        <img src={p4.image} alt={p4.name} />
      </figure>
      <div className="r-card-4-meta region control" data-region="card-4-meta">
        <div>
          <p className="comp-card-title">{p4.name}</p>
          <p className="comp-card-sub">{p4.subtitle}</p>
        </div>
        <div className="comp-card-foot">
          <span className="comp-card-price" aria-label={`${p4.price} ريال سعودي`}>
            {p4.price} ر.س
          </span>
          <button
            type="button"
            className="comp-card-btn"
            data-hero-add="4"
            onClick={() => onAddToCart(p4)}
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </section>
  );
};

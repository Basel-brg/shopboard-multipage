import { Suspense, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../modules/cart/context/useCart';
import { useAuth } from '../modules/auth/context/useAuth';
import { CartDrawer } from '../modules/cart/components/CartDrawer';
import { AuthModal } from '../modules/auth/components/AuthModal';
import { DeskStudioContainer } from '../desk-builder/DeskStudioContainer';
import { Footer } from '../shared/components/Footer/Footer';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { PageSkeleton } from '../shared/components/PageSkeleton';

export function RootLayout() {
  const { state: cartState, toggleCart } = useCart();
  const { user, openModal: openAuthModal } = useAuth();
  const [isDeskStudioOpen, setIsDeskStudioOpen] = useState(false);
  const location = useLocation();

  // On the home page ('/'), the desktop Atelier rail in ProductsHero serves as the primary navigation.
  // On all sub-pages (/cart, /checkout, /orders, /products/:id, /404), the global styled header is displayed.
  const isHomePage = location.pathname === '/';

  return (
    <div id="app" className="multipage-app-layout" dir="rtl" lang="ar">
      {/* Global Navigation Header (Shown on all sub-pages) */}
      {!isHomePage && (
        <header className="site-header global-nav" role="banner">
          <div className="container header-inner">
            <div className="brand-group">
              <Link to="/" className="brand-link" aria-label="شوب بورد - الصفحة الرئيسية">
                <span className="enso-mark" aria-hidden="true">
                  ◎
                </span>
                <span className="brand-name">شوب بورد · ShopBoard</span>
              </Link>
            </div>

            <nav className="main-nav-links" aria-label="روابط الموقع الرئيسية">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                end
              >
                الكتالوج
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                طلباتي
              </NavLink>

              <button
                type="button"
                className="nav-link desk-studio-nav-btn"
                onClick={() => setIsDeskStudioOpen(true)}
                aria-label="فتح استوديو تصميم المكتب ثلاثي الأبعاد"
              >
                استوديو 3D
              </button>
            </nav>

            <div className="header-actions">
              {user ? (
                <span className="user-greeting">مرحباً، {user.name}</span>
              ) : (
                <button
                  type="button"
                  className="auth-btn"
                  onClick={openAuthModal}
                  aria-label="تسجيل الدخول أو إنشاء حساب"
                >
                  تسجيل الدخول
                </button>
              )}

              <button
                type="button"
                className="cart-trigger-btn"
                onClick={toggleCart}
                aria-label={`سلة المشتريات (${cartState.count} قطع)`}
              >
                <span>السلة</span>
                {cartState.count > 0 && <span className="cart-badge">{cartState.count}</span>}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Outlet with Error Boundary and Suspense for Code-Split Pages */}
      <main className="main-viewport" role="main">
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Persistent Global Modals and Drawers */}
      <CartDrawer />
      <AuthModal />
      <DeskStudioContainer isOpen={isDeskStudioOpen} onClose={() => setIsDeskStudioOpen(false)} />

      <Footer />
    </div>
  );
}

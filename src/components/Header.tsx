export interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand-group">
          <span className="enso-mark" aria-hidden="true">
            ◎
          </span>
          <span className="brand-name">شوب بورد · ShopBoard</span>
        </div>
        <nav aria-label="التنقل الرئيسي">
          <button
            type="button"
            className="cart-trigger-btn"
            onClick={onOpenCart}
            aria-label={`سلة المشتريات (${cartCount} قطع)`}
          >
            <span>السلة</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}

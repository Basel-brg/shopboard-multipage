import { useState } from 'react';
import { ProductsHero } from '../modules/products/components/ProductsHero';
import { ProductsContainer } from '../modules/products/components/ProductsContainer';
import { DeskStudioContainer } from '../desk-builder/DeskStudioContainer';
import { useAuth } from '../modules/auth/context/useAuth';
import { useCart } from '../modules/cart/context/useCart';
import { useOrders } from '../modules/orders/context/useOrders';

export default function HomePage() {
  const [isDeskStudioOpen, setIsDeskStudioOpen] = useState(false);
  const { user, openModal: openAuthModal } = useAuth();
  const { toggleCart, state: cartState, addItem } = useCart();
  const { openOrdersModal } = useOrders();

  return (
    <div className="home-page-view">
      <ProductsHero
        onOpenDeskStudio={() => setIsDeskStudioOpen(true)}
        onOpenOrders={openOrdersModal}
        onOpenAuth={openAuthModal}
        onToggleCart={toggleCart}
        cartCount={cartState.count}
        cartTotal={cartState.total}
        userName={user?.name}
        onAddToCart={addItem}
      />

      <ProductsContainer />

      <DeskStudioContainer isOpen={isDeskStudioOpen} onClose={() => setIsDeskStudioOpen(false)} />
    </div>
  );
}

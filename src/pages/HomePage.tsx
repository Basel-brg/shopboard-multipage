import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsHero } from '../modules/products/components/ProductsHero';
import { ProductsContainer } from '../modules/products/components/ProductsContainer';
import { DeskStudioContainer } from '../desk-builder/DeskStudioContainer';
import { useAuth } from '../modules/auth/context/useAuth';
import { useCart } from '../modules/cart/context/useCart';

export default function HomePage() {
  const navigate = useNavigate();
  const [isDeskStudioOpen, setIsDeskStudioOpen] = useState(false);
  const { user, openModal: openAuthModal } = useAuth();
  const { toggleCart, state: cartState, addItem } = useCart();

  return (
    <div className="home-page-view">
      <ProductsHero
        onOpenDeskStudio={() => setIsDeskStudioOpen(true)}
        onOpenOrders={() => navigate('/orders')}
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

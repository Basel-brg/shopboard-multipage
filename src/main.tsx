import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

import { ToastProvider } from './shared/components/Toast/ToastContext';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { OrdersProvider } from './modules/orders/context/OrdersContext';
import { CartProvider } from './modules/cart/context/CartContext';
import { ProductsProvider } from './modules/products/context/ProductsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root container element #root not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <ProductsProvider>
              <App />
            </ProductsProvider>
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>,
);

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CartItem, CartState, Coupon } from '../cart.types';
import type { Product } from '../../products/products.types';
import { calculateCartState, VALID_COUPONS } from '../cart.logic';
import { useToast } from '../../../shared/components/Toast/ToastContext';

const STORAGE_KEY = 'shopboard_cart_v2';

interface CartContextValue {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  state: CartState;
  addItem: (product: Product | CartItem, quantity?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCartItems(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartItems);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable
    }
  }, [items]);

  const state = useMemo(() => {
    return calculateCartState(items, appliedCoupon);
  }, [items, appliedCoupon]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (product: Product | CartItem, quantity: number = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === product.id);
        if (existingIndex > -1) {
          return prev.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            artwork: product.artwork,
            tone: product.tone,
            quantity,
          },
        ];
      });
      showToast(`تمت إضافة "${product.name}" إلى السلة`);
    },
    [showToast],
  );

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }, []);

  const removeItem = useCallback(
    (productId: number) => {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      showToast('تمت إزالة المنتج من السلة');
    },
    [showToast],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    showToast('تم تفريغ حقيبة التسوق بالكامل');
  }, [showToast]);

  const applyCoupon = useCallback(
    (code: string): boolean => {
      const normalized = code.trim().toUpperCase();
      const coupon = VALID_COUPONS[normalized];
      if (coupon) {
        setAppliedCoupon(coupon);
        showToast(`تم تطبيق كود الخصم "${coupon.code}" (${coupon.label}) بنجاح`);
        return true;
      } else {
        showToast('كود الخصم غير صالح — جرب SHOP20 أو WELCOME10');
        return false;
      }
    },
    [showToast],
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('تم إلغاء كود الخصم');
  }, [showToast]);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        state,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

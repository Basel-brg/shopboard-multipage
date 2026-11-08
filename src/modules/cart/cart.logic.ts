import type { CartItem, CartState, Coupon } from './cart.types';

export const FREE_SHIPPING_THRESHOLD = 300;

export const VALID_COUPONS: Record<string, Coupon> = {
  SHOP20: { code: 'SHOP20', percent: 20, label: 'خصم 20%' },
  WELCOME10: { code: 'WELCOME10', percent: 10, label: 'خصم 10%' },
};

export function calculateCartState(items: CartItem[], appliedCoupon: Coupon | null): CartState {
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.percent) / 100) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : 25;
  const total = discountedSubtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const shippingProgress = Math.min(
    100,
    Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  return {
    items: [...items],
    count,
    subtotal,
    discountAmount,
    appliedCoupon,
    shipping,
    total,
    remainingForFreeShipping,
    shippingProgress,
  };
}

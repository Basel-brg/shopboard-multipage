export interface Coupon {
  code: string;
  percent: number;
  label: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  artwork?: string;
  tone?: string;
}

export interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  discountAmount: number;
  appliedCoupon: Coupon | null;
  shipping: number;
  total: number;
  remainingForFreeShipping: number;
  shippingProgress: number;
}

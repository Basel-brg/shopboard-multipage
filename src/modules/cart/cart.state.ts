import type { CartItem, CartState, Coupon } from './cart.types';
import type { Product } from '../products/products.types';
import { calculateCartState, VALID_COUPONS } from './cart.logic';

const STORAGE_KEY = 'shopboard_cart_v2';

export type CartListener = (state: CartState) => void;

export class CartManager {
  private listeners: Set<CartListener>;
  private items: CartItem[];
  private appliedCoupon: Coupon | null;

  constructor() {
    this.listeners = new Set();
    this.items = this.loadCart();
    this.appliedCoupon = null;
  }

  loadCart(): CartItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // storage unavailable or full
    }
    this.notify();
  }

  subscribe(listener: CartListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify(): void {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  addItem(
    product: Product | (CartItem & { tone?: string; artwork?: string }),
    quantity: number = 1,
  ): void {
    const existing = this.items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        artwork: product.artwork,
        tone: product.tone,
        category: product.category,
        quantity: quantity,
      });
    }
    this.saveCart();
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.id !== productId);
    if (this.items.length === 0) {
      this.appliedCoupon = null;
    }
    this.saveCart();
  }

  updateQuantity(productId: number, delta: number): void {
    const item = this.items.find((i) => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCart();
    }
  }

  applyCoupon(rawCode: string): Coupon | null {
    const normalized = rawCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[normalized];
    if (!coupon) {
      return null;
    }
    this.appliedCoupon = coupon;
    this.notify();
    return coupon;
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.notify();
  }

  clear(): void {
    this.items = [];
    this.appliedCoupon = null;
    this.saveCart();
  }

  getState(): CartState {
    return calculateCartState(this.items, this.appliedCoupon);
  }
}

export const cart = new CartManager();

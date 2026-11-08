export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO date string
  customerName: string;
  customerPhone: string;
  customerCity: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export type OrderSortOption = 'date-desc' | 'date-asc' | 'total-desc' | 'total-asc';

export interface OrderFilterOptions {
  status: 'all' | OrderStatus;
  searchQuery: string;
  sortBy: OrderSortOption;
}

export type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Order[] }
  | { status: 'error'; message: string }
  | { status: 'empty'; reason: 'no-orders' | 'no-match' };

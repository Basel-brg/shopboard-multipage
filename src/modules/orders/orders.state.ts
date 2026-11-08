import type { Order, OrderFilterOptions, LoadState } from './orders.types';
import { DEMO_ORDERS, fetchRemoteOrders, type FetchOrdersOptions } from './orders.api';
import { filterOrders, calculateOrdersSummary, type OrdersSummary } from './orders.logic';

export interface OrdersStateData {
  allOrders: Order[];
  filteredOrders: Order[];
  loadState: LoadState;
  filters: OrderFilterOptions;
  summary: OrdersSummary;
}

export type OrdersListener = (state: OrdersStateData) => void;

const STORAGE_KEY = 'shopboard_orders_v1';

const DEFAULT_FILTERS: OrderFilterOptions = {
  status: 'all',
  searchQuery: '',
  sortBy: 'date-desc',
};

export class OrdersManager {
  private listeners: Set<OrdersListener>;
  private allOrders: Order[];
  private loadState: LoadState;
  private filters: OrderFilterOptions;

  constructor() {
    this.listeners = new Set();
    this.filters = { ...DEFAULT_FILTERS };
    this.allOrders = this.loadFromStorage();
    this.loadState = { status: 'idle' };
  }

  private loadFromStorage(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Storage unavailable or corrupted
    }
    // Initialize with demo orders
    this.saveToStorage([...DEMO_ORDERS]);
    return [...DEMO_ORDERS];
  }

  private saveToStorage(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage errors
    }
  }

  private computeFiltered(): Order[] {
    return filterOrders(this.allOrders, this.filters);
  }

  private updateLoadStateForSuccess(): void {
    if (this.allOrders.length === 0) {
      this.loadState = { status: 'empty', reason: 'no-orders' };
    } else {
      const filtered = this.computeFiltered();
      if (filtered.length === 0) {
        this.loadState = { status: 'empty', reason: 'no-match' };
      } else {
        this.loadState = { status: 'success', data: filtered };
      }
    }
  }

  getState(): OrdersStateData {
    return {
      allOrders: this.allOrders,
      filteredOrders: this.computeFiltered(),
      loadState: this.loadState,
      filters: { ...this.filters },
      summary: calculateOrdersSummary(this.allOrders),
    };
  }

  subscribe(listener: OrdersListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  async load(options: FetchOrdersOptions = {}): Promise<void> {
    this.loadState = { status: 'loading' };
    this.notify();

    try {
      const remote = await fetchRemoteOrders(options);
      if (options.simulateEmpty) {
        this.allOrders = [];
      } else if (remote.length > 0) {
        this.allOrders = remote;
      }
      this.saveToStorage(this.allOrders);
      this.updateLoadStateForSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء تحميل الطلبات.';
      this.loadState = { status: 'error', message };
    }

    this.notify();
  }

  addOrder(order: Order): void {
    this.allOrders.unshift(order);
    this.saveToStorage(this.allOrders);
    this.updateLoadStateForSuccess();
    this.notify();
  }

  cancelOrder(orderId: string): boolean {
    const order = this.allOrders.find((o) => o.id === orderId);
    if (!order) return false;

    if (order.status === 'delivered') {
      return false; // Cannot cancel delivered order
    }

    order.status = 'cancelled';
    this.saveToStorage(this.allOrders);
    this.updateLoadStateForSuccess();
    this.notify();
    return true;
  }

  setFilter(partial: Partial<OrderFilterOptions>): void {
    this.filters = { ...this.filters, ...partial };
    this.updateLoadStateForSuccess();
    this.notify();
  }

  resetFilters(): void {
    this.filters = { ...DEFAULT_FILTERS };
    this.updateLoadStateForSuccess();
    this.notify();
  }

  // Purposeful state simulator for testing and live evaluation
  simulateState(state: LoadState): void {
    this.loadState = state;
    this.notify();
  }
}

export const ordersState = new OrdersManager();

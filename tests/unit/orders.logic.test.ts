import { describe, it, expect } from 'vitest';
import {
  filterOrders,
  sortOrders,
  calculateOrdersSummary,
  getOrderStatusBadge,
} from '../../src/modules/orders/orders.logic';
import type { Order, OrderFilterOptions } from '../../src/modules/orders/orders.types';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'SB-111111',
    createdAt: '2026-11-01T10:00:00Z',
    customerName: 'محمد أحمد',
    customerPhone: '0512345678',
    customerCity: 'الرياض',
    paymentMethod: 'cod',
    status: 'shipped',
    items: [{ id: 1, productId: 1, name: 'ماوس عمودي', price: 200, quantity: 1 }],
    subtotal: 200,
    discount: 0,
    shipping: 25,
    total: 225,
  },
  {
    id: 'ord-2',
    orderNumber: 'SB-222222',
    createdAt: '2026-11-02T12:00:00Z',
    customerName: 'سارة خالد',
    customerPhone: '0598765432',
    customerCity: 'جدة',
    paymentMethod: 'card',
    status: 'delivered',
    items: [{ id: 2, productId: 2, name: 'لوحة مفاتيح', price: 300, quantity: 2 }],
    subtotal: 600,
    discount: 50,
    shipping: 0,
    total: 550,
  },
  {
    id: 'ord-3',
    orderNumber: 'SB-333333',
    createdAt: '2026-11-03T15:00:00Z',
    customerName: 'فهد تركي',
    customerPhone: '0544332211',
    customerCity: 'الدمام',
    paymentMethod: 'applepay',
    status: 'cancelled',
    items: [{ id: 3, productId: 3, name: 'مصباح', price: 150, quantity: 1 }],
    subtotal: 150,
    discount: 0,
    shipping: 25,
    total: 175,
  },
];

describe('orders.logic', () => {
  it('returns correct status badges', () => {
    expect(getOrderStatusBadge('pending').label).toBe('قيد الانتظار');
    expect(getOrderStatusBadge('shipped').label).toBe('تم الشحن');
    expect(getOrderStatusBadge('delivered').label).toBe('تم التوصيل');
  });

  it('filters orders by status and search query', () => {
    const filterStatus: OrderFilterOptions = {
      status: 'shipped',
      searchQuery: '',
      sortBy: 'date-desc',
    };
    const resStatus = filterOrders(MOCK_ORDERS, filterStatus);
    expect(resStatus).toHaveLength(1);
    expect(resStatus[0].id).toBe('ord-1');

    const filterSearch: OrderFilterOptions = {
      status: 'all',
      searchQuery: 'جدة',
      sortBy: 'date-desc',
    };
    const resSearch = filterOrders(MOCK_ORDERS, filterSearch);
    expect(resSearch).toHaveLength(1);
    expect(resSearch[0].customerName).toBe('سارة خالد');
  });

  it('calculates orders summary ignoring cancelled amounts', () => {
    const summary = calculateOrdersSummary(MOCK_ORDERS);
    expect(summary.totalOrders).toBe(3);
    // 225 + 550 = 775 (cancelled 175 is excluded from totalSpent)
    expect(summary.totalSpent).toBe(775);
    expect(summary.activeOrders).toBe(1); // shipped
    expect(summary.completedOrders).toBe(1); // delivered
  });

  it('sorts orders by total and date', () => {
    const sortedByTotal = sortOrders(MOCK_ORDERS, 'total-desc');
    expect(sortedByTotal.map((o) => o.total)).toEqual([550, 225, 175]);
  });
});

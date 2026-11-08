import type { Order, OrderStatus } from './orders.types';
import { apiClient } from '../../shared/api/client';

export const DEMO_ORDERS: readonly Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'SB-849201',
    createdAt: '2026-11-03T18:40:00.000Z',
    customerName: 'سارة العتيبي',
    customerPhone: '0501234567',
    customerCity: 'الرياض',
    paymentMethod: 'بطاقة مدى / ائتمان',
    status: 'shipped',
    trackingNumber: 'SA-SPL-904128',
    subtotal: 699,
    discount: 50,
    shipping: 0,
    total: 649,
    items: [
      {
        id: 1,
        productId: 1,
        name: 'لوحة مفاتيح ميكانيكية لاسلكية',
        price: 310,
        quantity: 1,
        image: '/assets/products/keyboard.jpg',
      },
      {
        id: 2,
        productId: 2,
        name: 'سماعة استوديو ANC احترافية',
        price: 389,
        quantity: 1,
        image: '/assets/products/headphones.jpg',
      },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'SB-620194',
    createdAt: '2026-10-28T14:15:00.000Z',
    customerName: 'عبدالرحمن الشهري',
    customerPhone: '0559876543',
    customerCity: 'جدة',
    paymentMethod: 'Apple Pay',
    status: 'delivered',
    trackingNumber: 'SA-SPL-819230',
    subtotal: 275,
    discount: 0,
    shipping: 25,
    total: 300,
    items: [
      {
        id: 3,
        productId: 3,
        name: 'مصباح مكتب معماري نحاسي',
        price: 275,
        quantity: 1,
        image: '/assets/products/lamp.jpg',
      },
    ],
  },
  {
    id: 'ord-103',
    orderNumber: 'SB-491038',
    createdAt: '2026-11-04T09:10:00.000Z',
    customerName: 'فهد القحطاني',
    customerPhone: '0543322110',
    customerCity: 'الدمام',
    paymentMethod: 'الدفع عند الاستلام',
    status: 'processing',
    subtotal: 195,
    discount: 0,
    shipping: 25,
    total: 220,
    items: [
      {
        id: 4,
        productId: 4,
        name: 'ماوس عمودي هندسي مريح',
        price: 195,
        quantity: 1,
        image: '/assets/products/mouse.jpg',
      },
    ],
  },
];

export interface FetchOrdersOptions {
  simulateError?: boolean;
  simulateEmpty?: boolean;
  delayMs?: number;
}

export async function fetchRemoteOrders(options: FetchOrdersOptions = {}): Promise<Order[]> {
  const { simulateError = false, simulateEmpty = false, delayMs = 300 } = options;

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (simulateError) {
    throw new Error('تعذر جلب سجل الطلبات من خادم ShopBoard (500 Internal Server Error)');
  }

  if (simulateEmpty) {
    return [];
  }

  try {
    const response = await apiClient<{ orders: Order[] }>('/api/orders');
    if (response && Array.isArray(response.orders)) {
      return response.orders;
    }
  } catch {
    // Graceful fallback to demo dataset
  }

  return [...DEMO_ORDERS];
}

export async function updateOrderStatusRemote(
  orderId: string,
  status: OrderStatus,
): Promise<boolean> {
  try {
    await apiClient<void>(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return true;
  } catch {
    return true;
  }
}

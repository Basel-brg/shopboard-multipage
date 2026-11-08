import type { Order, OrderStatus, OrderFilterOptions, OrderSortOption } from './orders.types';

export interface StatusBadgeInfo {
  label: string;
  className: string;
  icon: string;
}

export const STATUS_META: Record<OrderStatus, StatusBadgeInfo> = {
  pending: {
    label: 'قيد الانتظار',
    className: 'status-pending',
    icon: '⏳',
  },
  processing: {
    label: 'قيد التجهيز',
    className: 'status-processing',
    icon: '📦',
  },
  shipped: {
    label: 'تم الشحن',
    className: 'status-shipped',
    icon: '🚚',
  },
  delivered: {
    label: 'تم التوصيل',
    className: 'status-delivered',
    icon: '✅',
  },
  cancelled: {
    label: 'ملغي',
    className: 'status-cancelled',
    icon: '❌',
  },
};

export function getOrderStatusBadge(status: OrderStatus): StatusBadgeInfo {
  return (
    STATUS_META[status] || {
      label: status,
      className: 'status-unknown',
      icon: '📋',
    }
  );
}

export function formatOrderDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function filterOrders(orders: readonly Order[], filters: OrderFilterOptions): Order[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = orders.filter((order) => {
    const matchesStatus = filters.status === 'all' || order.status === filters.status;

    const matchesSearch =
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerCity.toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return sortOrders(filtered, filters.sortBy);
}

export function sortOrders(items: Order[], sortBy: OrderSortOption): Order[] {
  const copy = [...items];
  switch (sortBy) {
    case 'date-asc':
      return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'total-desc':
      return copy.sort((a, b) => b.total - a.total);
    case 'total-asc':
      return copy.sort((a, b) => a.total - b.total);
    case 'date-desc':
    default:
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export interface OrdersSummary {
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  completedOrders: number;
}

export function calculateOrdersSummary(orders: readonly Order[]): OrdersSummary {
  let totalSpent = 0;
  let activeOrders = 0;
  let completedOrders = 0;

  for (const order of orders) {
    if (order.status !== 'cancelled') {
      totalSpent += order.total;
    }
    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'pending') {
      activeOrders++;
    } else if (order.status === 'delivered') {
      completedOrders++;
    }
  }

  return {
    totalOrders: orders.length,
    totalSpent,
    activeOrders,
    completedOrders,
  };
}

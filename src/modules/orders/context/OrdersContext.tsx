import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Order, OrderFilterOptions, OrderStatus, LoadState } from '../orders.types';
import { DEMO_ORDERS, fetchRemoteOrders } from '../orders.api';
import { filterOrders, calculateOrdersSummary, type OrdersSummary } from '../orders.logic';
import { useToast } from '../../../shared/components/Toast/ToastContext';

const STORAGE_KEY = 'shopboard_orders_v1';

const DEFAULT_FILTERS: OrderFilterOptions = {
  status: 'all',
  searchQuery: '',
  sortBy: 'date-desc',
};

interface OrdersContextValue {
  allOrders: Order[];
  filteredOrders: Order[];
  loadState: LoadState;
  filters: OrderFilterOptions;
  summary: OrdersSummary;
  isOrdersModalOpen: boolean;
  selectedOrder: Order | null;
  confirmedOrder: Order | null;
  activeTestState: string;
  openOrdersModal: () => void;
  closeOrdersModal: () => void;
  openOrderDetails: (order: Order) => void;
  closeOrderDetails: () => void;
  closeOrderConfirmed: () => void;
  setStatusFilter: (status: 'all' | OrderStatus) => void;
  setSearchQuery: (query: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setTestState: (stateKey: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

function loadOrdersFromStorage(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }
  return [...DEMO_ORDERS];
}

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allOrders, setAllOrders] = useState<Order[]>(loadOrdersFromStorage);
  const [filters, setFilters] = useState<OrderFilterOptions>(DEFAULT_FILTERS);
  const [activeTestState, setActiveTestState] = useState<string>('live');
  const [customLoadState, setCustomLoadState] = useState<LoadState | null>(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allOrders));
    } catch {
      // ignore
    }
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    return filterOrders(allOrders, filters);
  }, [allOrders, filters]);

  const summary = useMemo(() => {
    return calculateOrdersSummary(allOrders);
  }, [allOrders]);

  const loadState: LoadState = useMemo(() => {
    if (customLoadState) return customLoadState;

    if (allOrders.length === 0) {
      return { status: 'empty', reason: 'no-orders' };
    }
    if (filteredOrders.length === 0) {
      return { status: 'empty', reason: 'no-match' };
    }
    return { status: 'success', data: filteredOrders };
  }, [customLoadState, allOrders.length, filteredOrders]);

  const openOrdersModal = useCallback(() => setIsOrdersModalOpen(true), []);
  const closeOrdersModal = useCallback(() => setIsOrdersModalOpen(false), []);

  const openOrderDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const closeOrderDetails = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const closeOrderConfirmed = useCallback(() => {
    setConfirmedOrder(null);
  }, []);

  const setStatusFilter = useCallback((status: 'all' | OrderStatus) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const createOrder = useCallback(
    (orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
      const newOrder: Order = {
        ...orderInput,
        id: `ord-${Date.now()}`,
        orderNumber: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        trackingNumber: `SA-SPL-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setAllOrders((prev) => [newOrder, ...prev]);
      setConfirmedOrder(newOrder);
      showToast(`تم تسجيل طلبك رقم ${newOrder.orderNumber} بنجاح!`);
      return newOrder;
    },
    [showToast],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setAllOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
      showToast('تم تحديث حالة الطلب بنجاح');
    },
    [showToast],
  );

  const setTestState = useCallback(async (stateKey: string) => {
    setActiveTestState(stateKey);
    switch (stateKey) {
      case 'loading':
        setCustomLoadState({ status: 'loading' });
        setTimeout(() => {
          setCustomLoadState(null);
          setActiveTestState('live');
        }, 2500);
        break;
      case 'error':
        setCustomLoadState({
          status: 'error',
          message: 'خطأ 503: تعذر الوصول إلى قاعدة بيانات الطلبات (Demo Test Error).',
        });
        break;
      case 'empty-server':
        setCustomLoadState({ status: 'empty', reason: 'no-orders' });
        break;
      case 'empty-search':
        setCustomLoadState({ status: 'empty', reason: 'no-match' });
        break;
      case 'live':
      default:
        setCustomLoadState(null);
        try {
          const fresh = await fetchRemoteOrders();
          if (fresh.length > 0) {
            setAllOrders(fresh);
          }
        } catch {
          // keep local
        }
        break;
    }
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        allOrders,
        filteredOrders,
        loadState,
        filters,
        summary,
        isOrdersModalOpen,
        selectedOrder,
        confirmedOrder,
        activeTestState,
        openOrdersModal,
        closeOrdersModal,
        openOrderDetails,
        closeOrderDetails,
        closeOrderConfirmed,
        setStatusFilter,
        setSearchQuery,
        createOrder,
        updateOrderStatus,
        setTestState,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}

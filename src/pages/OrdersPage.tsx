import { useState } from 'react';
import { useOrders } from '../modules/orders/context/useOrders';
import type { Order, OrderStatus } from '../modules/orders/orders.types';
import { OrderCard } from '../modules/orders/components/OrderCard';
import { OrderDetailsModal } from '../modules/orders/components/OrderDetailsModal';

type FilterStatus = 'all' | OrderStatus;

function isFilterStatus(val: string): val is FilterStatus {
  return ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(val);
}

export default function OrdersPage() {
  const { allOrders, loadState, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      q === '' ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.items.some((item) => item.name.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="container orders-page-view">
      <header className="orders-page-header">
        <h1 className="page-title">إدارة ومتابعة الطلبات</h1>
        <p className="page-subtitle">تتبع شحناتك الحالية وسجل فواتيرك السابقة بكل شفافية وسهولة.</p>
      </header>

      <div className="orders-controls-bar">
        <div className="search-box">
          <label htmlFor="orders-page-search" className="sr-only">
            البحث في الطلبات
          </label>
          <input
            id="orders-page-search"
            type="search"
            placeholder="ابحث برقم الطلب، اسم العميل، أو اسم المنتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
        </div>

        <div className="filter-box">
          <label htmlFor="orders-page-status" className="filter-label">
            الحالة:
          </label>
          <select
            id="orders-page-status"
            value={statusFilter}
            onChange={(e) => {
              const val = e.target.value;
              if (isFilterStatus(val)) {
                setStatusFilter(val);
              }
            }}
            className="orders-status-select"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="processing">قيد المعالجة</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {loadState.status === 'loading' ? (
        <div className="orders-loading-grid" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-skeleton-card" />
          ))}
        </div>
      ) : loadState.status === 'error' ? (
        <div className="orders-error-banner" role="alert">
          <p>{loadState.message}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty-state" role="status">
          <span className="empty-box-icon" aria-hidden="true">
            📦
          </span>
          <h3>
            {searchQuery || statusFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا توجد طلبات سابقة'}
          </h3>
          <p>
            {searchQuery || statusFilter !== 'all'
              ? 'جرب تغيير كلمة البحث أو فلاتر الحالة المعروضة.'
              : 'لم تقم بإنشاء أي طلبات حتى الآن. تفضل بزيارة الكتالوج لبدء أول طلب.'}
          </p>
        </div>
      ) : (
        <div className="orders-grid-list">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={(ord) => setSelectedOrder(ord)}
              onCancelOrder={(orderId) => updateOrderStatus(orderId, 'cancelled')}
            />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

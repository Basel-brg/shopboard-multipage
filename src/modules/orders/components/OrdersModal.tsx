import React from 'react';
import { useOrders } from '../context/useOrders';
import { OrderCard } from './OrderCard';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Modal } from '../../../shared/components/Modal/Modal';
import { IconClose } from '../../../shared/components/Icons/Icons';
import type { OrderStatus } from '../orders.types';

type FilterStatus = 'all' | OrderStatus;

function isFilterStatus(value: string): value is FilterStatus {
  return (
    value === 'all' ||
    value === 'pending' ||
    value === 'processing' ||
    value === 'shipped' ||
    value === 'delivered' ||
    value === 'cancelled'
  );
}

export const OrdersModal: React.FC = () => {
  const {
    filteredOrders,
    loadState,
    filters,
    summary,
    isOrdersModalOpen,
    closeOrdersModal,
    selectedOrder,
    openOrderDetails,
    closeOrderDetails,
    activeTestState,
    setStatusFilter,
    setSearchQuery,
    updateOrderStatus,
    setTestState,
  } = useOrders();

  const handleCancelOrder = (orderId: string) => {
    const ok = window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟');
    if (ok) {
      updateOrderStatus(orderId, 'cancelled');
    }
  };

  const renderOrdersBody = () => {
    switch (loadState.status) {
      case 'idle':
        return (
          <div className="state-feedback-card state-idle">
            <p className="state-desc">اضغط لتحميل سجل الطلبات...</p>
          </div>
        );

      case 'loading':
        return (
          <div className="orders-skeleton-list" aria-busy="true" aria-label="جاري تحميل الطلبات">
            {[1, 2, 3].map((n) => (
              <div key={n} className="order-card-skeleton shimmer">
                <div className="skeleton-header">
                  <div
                    className="skeleton-pill shimmer"
                    style={{ width: '110px', height: '26px' }}
                  />
                  <div
                    className="skeleton-pill shimmer"
                    style={{ width: '80px', height: '26px' }}
                  />
                </div>
                <div className="skeleton-body">
                  <div
                    className="skeleton-line shimmer"
                    style={{ width: '60%', height: '18px', marginBottom: '8px' }}
                  />
                  <div className="skeleton-line shimmer" style={{ width: '40%', height: '14px' }} />
                </div>
                <div className="skeleton-footer">
                  <div
                    className="skeleton-pill shimmer"
                    style={{ width: '100px', height: '24px' }}
                  />
                  <div
                    className="skeleton-pill shimmer"
                    style={{ width: '120px', height: '36px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'error':
        return (
          <div className="state-feedback-card state-error" role="alert">
            <div className="state-icon">⚠️</div>
            <h3 className="state-title">فشل في جلب سجل الطلبات</h3>
            <p className="state-desc">{loadState.message}</p>
            <button
              type="button"
              className="btn btn-primary"
              id="orders-retry-btn"
              onClick={() => setTestState('live')}
            >
              🔄 إعادة المحاولة (Try Again)
            </button>
          </div>
        );

      case 'empty':
        if (loadState.reason === 'no-orders') {
          return (
            <div className="state-feedback-card state-empty">
              <div className="state-icon">📦</div>
              <h3 className="state-title">لا توجد طلبات سابقة حتى الآن</h3>
              <p className="state-desc">
                لم تقم بإتمام أي طلبات شراء بعد. اختر منتجاتك من المتجر وجهّز مكتبك الآن!
              </p>
              <button
                type="button"
                className="btn btn-primary"
                id="orders-shop-now-btn"
                onClick={closeOrdersModal}
              >
                🛍️ استكشف المتجر الآن
              </button>
            </div>
          );
        } else {
          return (
            <div className="state-feedback-card state-empty">
              <div className="state-icon">🔍</div>
              <h3 className="state-title">لا توجد طلبات مطابقة للبحث أو الفلتر</h3>
              <p className="state-desc">جرّب البحث برقم طلب آخر أو تغيير تصنيف حالة الطلب.</p>
              <button
                type="button"
                className="btn btn-primary"
                id="orders-reset-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTestState('live');
                }}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          );
        }

      case 'success':
      default:
        return (
          <div className="orders-list-grid">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={openOrderDetails}
                onCancelOrder={handleCancelOrder}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOrdersModalOpen}
        onClose={closeOrdersModal}
        id="orders-dialog"
        className="modal-dialog orders-dialog"
        aria-labelledby="orders-dialog-title"
      >
        <div className="modal-card orders-dialog-card">
          <header className="orders-dialog-header">
            <div className="orders-title-wrap">
              <h2 id="orders-dialog-title">سجل طلباتي</h2>
              <span id="orders-count-badge" className="count-badge">
                {filteredOrders.length} طلبات
              </span>
            </div>
            <button
              type="button"
              id="orders-dialog-close-btn"
              className="icon-close-btn"
              aria-label="إغلاق نافذة الطلبات"
              onClick={closeOrdersModal}
            >
              <IconClose size={20} />
            </button>
          </header>

          {/* Quick KPI Strip */}
          <div className="orders-kpi-strip">
            <div className="kpi-box">
              <span className="kpi-label">إجمالي المشتريات</span>
              <strong id="orders-summary-total" className="kpi-val">
                {summary.totalSpent.toLocaleString('ar-SA')} ر.س
              </strong>
            </div>
            <div className="kpi-box">
              <span className="kpi-label">طلبات نشطة / في الطريق</span>
              <strong id="orders-summary-active" className="kpi-val">
                {summary.activeOrders}
              </strong>
            </div>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="orders-controls-bar">
            <div className="orders-search-wrap">
              <label htmlFor="orders-search-input" className="sr-only">
                البحث في الطلبات
              </label>
              <input
                type="search"
                id="orders-search-input"
                name="orderSearch"
                className="orders-search-input"
                placeholder="بحث برقم الطلب، المدينة، أو اسم المنتج..."
                aria-label="البحث في الطلبات"
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="orders-filter-wrap">
              <label htmlFor="orders-status-select" className="sr-only">
                حالة الطلب
              </label>
              <select
                id="orders-status-select"
                name="orderStatus"
                className="orders-select"
                aria-label="تصفية حسب حالة الطلب"
                value={filters.status}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isFilterStatus(val)) {
                    setStatusFilter(val);
                  }
                }}
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="processing">قيد التجهيز</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>

          {/* 4-State Demo Toolbar */}
          <div className="orders-state-toolbar-wrap">
            <span className="toolbar-label">تجربة الحالات الأربع (Demo States):</span>
            <div
              className="orders-state-toolbar"
              id="orders-state-toolbar"
              role="toolbar"
              aria-label="شريط تجربة حالات الطلبات"
            >
              <button
                type="button"
                className={`state-test-btn ${activeTestState === 'live' ? 'is-active' : ''}`}
                data-orders-state="live"
                title="عرض البيانات الحقيقية"
                onClick={() => setTestState('live')}
              >
                ✅ Live
              </button>
              <button
                type="button"
                className={`state-test-btn ${activeTestState === 'loading' ? 'is-active' : ''}`}
                data-orders-state="loading"
                title="عرض حالة التحميل"
                onClick={() => setTestState('loading')}
              >
                ⏳ Loading
              </button>
              <button
                type="button"
                className={`state-test-btn ${activeTestState === 'error' ? 'is-active' : ''}`}
                data-orders-state="error"
                title="عرض شاشة الخطأ مع زر Try Again"
                onClick={() => setTestState('error')}
              >
                ⚠️ Error
              </button>
              <button
                type="button"
                className={`state-test-btn ${activeTestState === 'empty-server' ? 'is-active' : ''}`}
                data-orders-state="empty-server"
                title="عرض حالة الخادم الفارغ"
                onClick={() => setTestState('empty-server')}
              >
                📦 Empty (سجل فارغ)
              </button>
              <button
                type="button"
                className={`state-test-btn ${activeTestState === 'empty-search' ? 'is-active' : ''}`}
                data-orders-state="empty-search"
                title="عرض حالة لا توجد نتائج للبحث"
                onClick={() => setTestState('empty-search')}
              >
                🔍 Empty (لا نتائج)
              </button>
            </div>
          </div>

          {/* Orders Dynamic Container */}
          <div className="orders-container-scroll" id="orders-container" aria-live="polite">
            {renderOrdersBody()}
          </div>
        </div>
      </Modal>

      <OrderDetailsModal order={selectedOrder} onClose={closeOrderDetails} />
    </>
  );
};

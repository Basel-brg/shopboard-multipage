import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { DeskStudioScene } from '../studio-scene';
import { DeskStudioInteraction } from '../studio-interaction';
import { calculateSetupTotal, addSetupToCart } from '../studio-cart';
import { PRODUCTS } from '../../modules/products/products.api';
import { useCart } from '../../modules/cart/context/useCart';
import { useToast } from '../../shared/components/Toast/ToastContext';
import { Modal } from '../../shared/components/Modal/Modal';
import { IconClose } from '../../shared/components/Icons/Icons';

function getProductIcon(id: number): string {
  switch (id) {
    case 9:
      return '🖥️';
    case 10:
      return '📺';
    case 1:
      return '⌨️';
    case 4:
      return '🖱️';
    case 8:
      return '🪵';
    case 2:
      return '🎧';
    case 3:
      return '💡';
    case 5:
      return '🖊️';
    case 6:
      return '📐';
    case 7:
      return '🔌';
    default:
      return '📦';
  }
}

interface DeskStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeskStudioModal: React.FC<DeskStudioModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<DeskStudioScene | null>(null);
  const interactionRef = useRef<DeskStudioInteraction | null>(null);

  const [setupTotal, setSetupTotal] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<THREE.Group | null>(null);
  const [rotationDeg, setRotationDeg] = useState<number>(0);

  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const handleSelectionChange = useCallback((selected: THREE.Group | null) => {
    setSelectedItem(selected);
    if (selected) {
      const deg = Math.round(((selected.rotation.y * 180) / Math.PI) % 360);
      setRotationDeg(deg >= 0 ? deg : deg + 360);
    }
  }, []);

  const handleSetupChange = useCallback((placed: THREE.Group[]) => {
    setSetupTotal(calculateSetupTotal(placed));
  }, []);

  // Initialize scene and interaction when modal opens
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const scene = new DeskStudioScene();
    scene.init(canvasRef.current);
    sceneRef.current = scene;

    const interaction = new DeskStudioInteraction(scene, handleSelectionChange, handleSetupChange);
    interactionRef.current = interaction;

    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
      interactionRef.current = null;
    };
  }, [isOpen, handleSelectionChange, handleSetupChange]);

  const handleRotateChange = (deg: number) => {
    setRotationDeg(deg);
    if (interactionRef.current) {
      interactionRef.current.rotateSelected(deg);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItem && interactionRef.current) {
      interactionRef.current.deleteSelected();
      setSelectedItem(null);
    }
  };

  const handleClearDesk = () => {
    if (interactionRef.current) {
      interactionRef.current.clearAll();
      setSelectedItem(null);
      setSetupTotal(0);
      showToast('تم تفريغ سطح المكتب بالكامل');
    }
  };

  const handleAddAllToCart = () => {
    if (!interactionRef.current) return;
    const placed = interactionRef.current.placedObjects;
    if (placed.length === 0) {
      showToast('المكتب فارغ حالياً! اسحب منتجات إلى السطح أولاً');
      return;
    }

    const result = addSetupToCart(placed, addItem);
    showToast(
      `تمت إضافة ${result.totalItems} قطع من التشكيلة إلى السلة بقيمة ${result.totalAmount.toLocaleString('ar-SA')} ر.س`,
    );
    onClose();
    openCart();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      id="desk-builder-modal"
      className="desk-builder-dialog"
      aria-labelledby="desk-builder-title"
    >
      <div className="desk-builder-container" onContextMenu={(e) => e.preventDefault()}>
        {/* Top Bar */}
        <header className="studio-topbar">
          <div className="studio-branding">
            <span className="studio-badge">3D WebGL</span>
            <h2 id="desk-builder-title">استوديو تكوين مساحة العمل 3D</h2>
          </div>
          <div className="studio-top-actions">
            <button
              type="button"
              id="studio-clear-btn"
              className="studio-btn studio-btn-secondary"
              aria-label="تفريغ المكتب"
              onClick={handleClearDesk}
            >
              تفريغ السطح
            </button>
            <button
              type="button"
              id="desk-builder-close-btn"
              className="icon-close-btn studio-close"
              aria-label="إغلاق استوديو 3D"
              onClick={onClose}
            >
              <IconClose size={20} />
            </button>
          </div>
        </header>

        {/* 3D Canvas Stage */}
        <div id="studio-3d-canvas" className="studio-canvas" ref={canvasRef} />

        {/* Floating Right Catalog Drawer */}
        <aside className="studio-catalog-drawer" aria-label="كتالوج قطع المكتب ثلاثية الأبعاد">
          <div className="studio-drawer-header">
            <h3>📦 منتجات التجهيز</h3>
            <p>اضغط مطولاً واسحب القطعة مباشرة نحو المكتب</p>
          </div>
          <div id="studio-catalog-list" className="studio-catalog-items">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="studio-product-card"
                role="button"
                tabIndex={0}
                aria-label={`إضافة ${product.name} إلى سطح المكتب`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  interactionRef.current?.startSpawnDrag(product.id, e.clientX, e.clientY);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    interactionRef.current?.spawnAtCenter(product.id);
                  }
                }}
              >
                <div className="studio-card-icon" aria-hidden="true">
                  {getProductIcon(product.id)}
                </div>
                <div className="studio-card-info">
                  <span className="studio-card-title">{product.name}</span>
                  <span className="studio-card-price">
                    {product.price.toLocaleString('ar-SA')} ر.س
                  </span>
                </div>
                <span className="studio-drag-pill">اسحب</span>
              </div>
            ))}
          </div>
          <div className="studio-drawer-footer">
            <div className="studio-total-row">
              <span>مجموع التشكيلة:</span>
              <span id="studio-total-price" className="studio-total-val">
                {setupTotal.toLocaleString('ar-SA')} ر.س
              </span>
            </div>
            <button
              type="button"
              id="studio-add-cart-btn"
              className="studio-checkout-btn"
              onClick={handleAddAllToCart}
            >
              🛒 إضافة التشكيلة كاملة للسلة
            </button>
          </div>
        </aside>

        {/* Floating Bottom Selection & Rotation Bar */}
        <div
          id="studio-selected-bar"
          className={`studio-selected-bar ${selectedItem ? 'active' : ''}`}
          aria-label="التحكم بالقطعة المحددة"
        >
          <div className="selected-meta">
            <span className="meta-label">القطعة:</span>
            <span id="studio-selected-name" className="meta-val">
              {selectedItem?.userData.name || 'عنصر'}
            </span>
          </div>
          <div className="selected-rotation">
            <label htmlFor="studio-rotate-slider">🔄 التدوير:</label>
            <input
              type="range"
              id="studio-rotate-slider"
              name="itemRotation"
              aria-label="تدوير القطعة المحددة"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={rotationDeg}
              aria-valuetext={`${rotationDeg} درجة`}
              min="0"
              max="360"
              value={rotationDeg}
              onChange={(e) => handleRotateChange(Number(e.target.value))}
            />
            <span id="studio-rotate-val" className="rotation-deg">
              {rotationDeg}°
            </span>
          </div>
          <button
            type="button"
            id="studio-delete-btn"
            className="studio-delete-btn"
            aria-label="حذف القطعة المحددة"
            onClick={handleDeleteSelected}
          >
            🗑️ حذف
          </button>
        </div>

        {/* Quick Guidance Pill */}
        <div className="studio-guide-pill" aria-hidden="true">
          <span>💡 اسحب أي قطعة على الطاولة لنقلها، ولف الكاميرا بالماوس 360°</span>
        </div>
      </div>
    </Modal>
  );
};

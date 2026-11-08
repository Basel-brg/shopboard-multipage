import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Product, ProductFilterOptions, LoadState, SortOption } from '../products.types';
import { PRODUCTS, fetchRemoteProducts } from '../products.api';
import { filterProducts } from '../products.logic';
import { useToast } from '../../../shared/components/Toast/ToastContext';

interface ProductsContextValue {
  allProducts: Product[];
  filteredProducts: Product[];
  filters: ProductFilterOptions;
  loadState: LoadState;
  activeTestState: string;
  quickViewProduct: Product | null;
  setCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setMaxPrice: (price: number) => void;
  setSortBy: (sort: SortOption) => void;
  setTestState: (stateKey: string) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  fetchApiProducts: () => Promise<void>;
  resetToDefault: () => void;
}

const DEFAULT_FILTERS: ProductFilterOptions = {
  category: 'الكل',
  searchQuery: '',
  maxPrice: 6000,
  sortBy: 'default',
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([...PRODUCTS]);
  const [filters, setFilters] = useState<ProductFilterOptions>(DEFAULT_FILTERS);
  const [activeTestState, setActiveTestState] = useState<string>('success');
  const [customLoadState, setCustomLoadState] = useState<LoadState | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setMaxPrice = useCallback((maxPrice: number) => {
    setFilters((prev) => ({ ...prev, maxPrice }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, filters);
  }, [allProducts, filters]);

  // Determine computed LoadState
  const loadState: LoadState = useMemo(() => {
    if (customLoadState) return customLoadState;

    if (allProducts.length === 0) {
      return { status: 'empty', reason: 'no-products' };
    }

    if (filteredProducts.length === 0) {
      return { status: 'empty', reason: 'no-match' };
    }

    return { status: 'success', data: filteredProducts };
  }, [customLoadState, allProducts.length, filteredProducts]);

  const setTestState = useCallback((stateKey: string) => {
    setActiveTestState(stateKey);
    switch (stateKey) {
      case 'loading':
        setCustomLoadState({ status: 'loading' });
        setTimeout(() => {
          setCustomLoadState(null);
          setActiveTestState('success');
        }, 3000);
        break;
      case 'error':
        setCustomLoadState({
          status: 'error',
          message: 'فشل تحميل منتجات الكتالوج من الخادم (500 Internal Server Error)',
        });
        break;
      case 'empty-products':
        setCustomLoadState({ status: 'empty', reason: 'no-products' });
        break;
      case 'empty-match':
        setCustomLoadState({ status: 'empty', reason: 'no-match' });
        break;
      case 'success':
      default:
        setCustomLoadState(null);
        break;
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setCustomLoadState(null);
    setActiveTestState('success');
    setFilters(DEFAULT_FILTERS);
  }, []);

  const fetchApiProducts = useCallback(async () => {
    setCustomLoadState({ status: 'loading' });
    try {
      const remote = await fetchRemoteProducts();
      if (remote.length > 0) {
        setAllProducts([...PRODUCTS, ...remote]);
        showToast(`تم استيراد ${remote.length} منتجات بنجاح من API`);
      } else {
        showToast('لم يتم العثور على منتجات إضافية من API');
      }
      setCustomLoadState(null);
    } catch {
      showToast('تعذر الاتصال بـ API، تم الإبقاء على المنتجات المحلية');
      setCustomLoadState(null);
    }
  }, [showToast]);

  return (
    <ProductsContext.Provider
      value={{
        allProducts,
        filteredProducts,
        filters,
        loadState,
        activeTestState,
        quickViewProduct,
        setCategory,
        setSearchQuery,
        setMaxPrice,
        setSortBy,
        setTestState,
        openQuickView,
        closeQuickView,
        fetchApiProducts,
        resetToDefault,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}

import type { Product, LoadState, ProductFilterOptions, SortOption } from './products.types';
import { PRODUCTS, fetchRemoteProducts } from './products.api';
import { filterProducts } from './products.logic';

export interface ProductsStateData {
  allProducts: Product[];
  filteredProducts: Product[];
  loadState: LoadState;
  filters: ProductFilterOptions;
}

export type ProductsListener = (state: ProductsStateData) => void;

const DEFAULT_FILTERS: ProductFilterOptions = {
  category: 'الكل',
  searchQuery: '',
  maxPrice: 6000,
  sortBy: 'default',
};

export class ProductsManager {
  private listeners: Set<ProductsListener>;
  private allProducts: Product[];
  private loadState: LoadState;
  private filters: ProductFilterOptions;

  constructor() {
    this.listeners = new Set();
    this.allProducts = [...PRODUCTS];
    this.filters = { ...DEFAULT_FILTERS };
    this.loadState = { status: 'success', data: this.computeFiltered() };
  }

  private computeFiltered(): Product[] {
    return filterProducts(this.allProducts, this.filters);
  }

  private updateLoadStateForSuccess(): void {
    const filtered = this.computeFiltered();
    if (filtered.length === 0) {
      this.loadState = { status: 'empty', reason: 'no-match' };
    } else {
      this.loadState = { status: 'success', data: filtered };
    }
  }

  getState(): ProductsStateData {
    return {
      allProducts: this.allProducts,
      filteredProducts: this.computeFiltered(),
      loadState: this.loadState,
      filters: { ...this.filters },
    };
  }

  subscribe(listener: ProductsListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify(): void {
    const current = this.getState();
    this.listeners.forEach((fn) => fn(current));
  }

  async loadRemote(endpoint: string = '/api/products'): Promise<void> {
    this.loadState = { status: 'loading' };
    this.notify();

    try {
      const remote = await fetchRemoteProducts(endpoint);
      if (remote.length === 0) {
        this.allProducts = [];
        this.loadState = { status: 'empty', reason: 'no-products' };
        this.notify();
        return;
      }

      this.allProducts = [...PRODUCTS, ...remote];
      this.updateLoadStateForSuccess();
      this.notify();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر الاتصال بخادم المنتجات.';
      this.loadState = { status: 'error', message };
      this.notify();
    }
  }

  setCategory(category: string): void {
    this.filters.category = category;
    this.updateLoadStateForSuccess();
    this.notify();
  }

  setSearch(searchQuery: string): void {
    this.filters.searchQuery = searchQuery;
    this.updateLoadStateForSuccess();
    this.notify();
  }

  setPrice(maxPrice: number): void {
    this.filters.maxPrice = maxPrice;
    this.updateLoadStateForSuccess();
    this.notify();
  }

  setSort(sortBy: SortOption): void {
    this.filters.sortBy = sortBy;
    this.updateLoadStateForSuccess();
    this.notify();
  }

  resetFilters(): void {
    if (this.allProducts.length === 0) {
      this.allProducts = [...PRODUCTS];
    }
    this.filters = { ...DEFAULT_FILTERS };
    this.updateLoadStateForSuccess();
    this.notify();
  }

  getProductById(id: number): Product | undefined {
    return this.allProducts.find((p) => p.id === id);
  }
}

export const productsState = new ProductsManager();

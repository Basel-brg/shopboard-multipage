export interface Product {
  id: number;
  sku: string;
  name: string;
  subtitle?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  specs?: string[];
  warranty?: string;
  image: string;
  plateId?: string;
  tag?: string;
  tone?: string;
  artwork?: string;
  stock?: number;
  inStock?: boolean;
  badge?: string;
  toneClass?: string;
  artKey?: string;
  isFromApi?: boolean;
}

export type CategoryType =
  | 'الكل'
  | 'أجهزة ألعاب'
  | 'شاشات العرض'
  | 'لوحات مفاتيح'
  | 'صوتيات المكتب'
  | 'إضاءة المكتب'
  | 'ملحقات التحكم'
  | 'تنظيم المكتب'
  | string;

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductFilterOptions {
  category: string;
  searchQuery: string;
  maxPrice: number;
  sortBy: SortOption;
}

export interface ApiProduct {
  id: number;
  title: string;
  category_name: string;
  price_cents: number;
  in_stock: boolean;
}

export type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error'; message: string }
  | { status: 'empty'; reason: 'no-products' | 'no-match' };

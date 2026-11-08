import { describe, it, expect } from 'vitest';
import {
  getDiscountPercent,
  filterProducts,
  sortProducts,
} from '../../src/modules/products/products.logic';
import type { Product, ProductFilterOptions } from '../../src/modules/products/products.types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'SB-01',
    name: 'لوحة مفاتيح ميكانيكية',
    category: 'لوحات مفاتيح',
    price: 300,
    originalPrice: 400,
    rating: 4.9,
    reviewsCount: 10,
    description: 'لوحة ميكانيكية متطورة',
    image: '/test.jpg',
  },
  {
    id: 2,
    sku: 'SB-02',
    name: 'سماعة استوديو',
    category: 'صوتيات المكتب',
    price: 500,
    originalPrice: 500,
    rating: 4.7,
    reviewsCount: 20,
    description: 'سماعة عازلة',
    image: '/test2.jpg',
  },
  {
    id: 3,
    sku: 'SB-03',
    name: 'مصباح معماري',
    category: 'إضاءة المكتب',
    price: 150,
    rating: 4.5,
    reviewsCount: 5,
    description: 'مصباح نحاسي دافئ',
    image: '/test3.jpg',
  },
];

describe('products.logic', () => {
  it('calculates discount percent correctly', () => {
    expect(getDiscountPercent(300, 400)).toBe(25);
    expect(getDiscountPercent(500, 500)).toBe(0);
    expect(getDiscountPercent(500)).toBe(0);
  });

  it('filters by category, search, and price correctly', () => {
    const options: ProductFilterOptions = {
      category: 'لوحات مفاتيح',
      searchQuery: '',
      maxPrice: 6000,
      sortBy: 'default',
    };
    const res = filterProducts(MOCK_PRODUCTS, options);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);

    const priceFilter: ProductFilterOptions = {
      category: 'الكل',
      searchQuery: '',
      maxPrice: 350,
      sortBy: 'default',
    };
    const cheapRes = filterProducts(MOCK_PRODUCTS, priceFilter);
    expect(cheapRes).toHaveLength(2); // 300 and 150

    const searchFilter: ProductFilterOptions = {
      category: 'الكل',
      searchQuery: 'استوديو',
      maxPrice: 6000,
      sortBy: 'default',
    };
    const searchRes = filterProducts(MOCK_PRODUCTS, searchFilter);
    expect(searchRes).toHaveLength(1);
    expect(searchRes[0].id).toBe(2);
  });

  it('sorts products deterministically by price and rating', () => {
    const asc = sortProducts(MOCK_PRODUCTS, 'price-asc');
    expect(asc.map((p) => p.price)).toEqual([150, 300, 500]);

    const desc = sortProducts(MOCK_PRODUCTS, 'price-desc');
    expect(desc.map((p) => p.price)).toEqual([500, 300, 150]);

    const rating = sortProducts(MOCK_PRODUCTS, 'rating');
    expect(rating.map((p) => p.rating)).toEqual([4.9, 4.7, 4.5]);
  });
});

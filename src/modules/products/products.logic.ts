import type { Product, SortOption, ProductFilterOptions } from './products.types';
import { PRODUCTS } from './products.api';

export function getDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function filterProducts(
  items: readonly Product[],
  options: ProductFilterOptions,
): Product[] {
  const query = options.searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesCategory = options.category === 'الكل' || item.category === options.category;
    const matchesPrice = item.price <= options.maxPrice;
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesPrice && matchesSearch;
  });

  return sortProducts(filtered, options.sortBy);
}

export function sortProducts(items: Product[], sortBy: SortOption): Product[] {
  const shallow = [...items];
  switch (sortBy) {
    case 'price-asc':
      return shallow.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return shallow.sort((a, b) => b.price - a.price);
    case 'rating':
      return shallow.sort((a, b) => b.rating - a.rating);
    case 'default':
    default:
      return shallow.sort((a, b) => {
        const indexA = PRODUCTS.findIndex((p) => p.id === a.id);
        const indexB = PRODUCTS.findIndex((p) => p.id === b.id);
        return indexA - indexB;
      });
  }
}

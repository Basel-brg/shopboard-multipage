import React from 'react';
import type { CategoryType, SortOption, Product } from '../products.types';
import { CATEGORIES } from '../products.api';
import { IconSearch } from '../../../shared/components/Icons/Icons';

interface ProductsFilterBarProps {
  categories: readonly CategoryType[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  allProducts: Product[];
}

export function isSortOption(value: string): value is SortOption {
  return (
    value === 'default' || value === 'price-asc' || value === 'price-desc' || value === 'rating'
  );
}

export const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  categories = CATEGORIES,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  allProducts,
}) => {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="controls-panel" aria-label="خيارات البحث والتصفية والفرز">
      <div className="controls-top-row">
        <form
          className="search-form"
          id="search-form"
          role="search"
          onSubmit={handleSearchSubmit}
          noValidate
        >
          <div className="form-field search-field-wrap">
            <label htmlFor="search-input" className="sr-only">
              البحث عن معدات المكتب
            </label>
            <div className="search-box">
              <span className="search-icon">
                <IconSearch size={20} />
              </span>
              <input
                type="search"
                id="search-input"
                name="q"
                aria-label="البحث عن معدات المكتب"
                placeholder="ابحث عن لوحة مفاتيح، سماعة استوديو، مصباح نحاسي..."
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <button type="submit" className="search-submit" aria-label="تنفيذ البحث">
                بحث
              </button>
            </div>
          </div>
        </form>

        <nav className="categories-nav" aria-label="تصنيفات معدات المكتب" id="categories-nav">
          {categories.map((cat) => {
            const count =
              cat === 'الكل'
                ? allProducts.length
                : allProducts.filter((p) => p.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                className={`category-btn ${isActive ? 'is-active' : ''}`}
                data-category={cat}
                aria-pressed={isActive}
                onClick={() => onSelectCategory(cat)}
              >
                <span>{cat}</span>
                <span className="category-count">{count}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <form
        className="filters-row"
        id="filters-form"
        noValidate
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="form-field price-filter-field">
          <label htmlFor="price-range-input" className="filter-label">
            الحد الأقصى للسعر: <strong id="price-range-output">{maxPrice} ر.س</strong>
          </label>
          <input
            type="range"
            id="price-range-input"
            name="maxPrice"
            aria-label="الحد الأقصى للسعر"
            aria-valuemin={50}
            aria-valuemax={6000}
            aria-valuenow={maxPrice}
            aria-valuetext={`${maxPrice} ريال سعودي`}
            min="50"
            max="6000"
            step="50"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
          />
        </div>

        <div className="form-field sort-filter-field">
          <label htmlFor="sort-select" className="filter-label">
            ترتيب حسب:
          </label>
          <select
            id="sort-select"
            name="sort"
            aria-label="ترتيب المنتجات"
            value={sortBy}
            onChange={(e) => {
              const val = e.target.value;
              if (isSortOption(val)) {
                onSortChange(val);
              }
            }}
          >
            <option value="default">الافتراضي (ترتيب الكتالوج)</option>
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </form>
    </section>
  );
};

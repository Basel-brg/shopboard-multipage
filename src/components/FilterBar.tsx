import type { SortOption } from '../modules/products/products.types';

export interface FilterBarProps {
  searchQuery: string;
  maxPrice: number;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onPriceChange: (price: number) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
}

function isSortOption(value: string): value is SortOption {
  return ['default', 'price-asc', 'price-desc', 'rating-desc'].includes(value);
}

export function FilterBar({
  searchQuery,
  maxPrice,
  sortBy,
  onSearchChange,
  onPriceChange,
  onSortChange,
  onResetFilters,
}: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="أدوات تصفية وبحث المنتجات">
      <div className="filter-group search-group">
        <label htmlFor="search-input" className="filter-label">
          البحث في الكتالوج
        </label>
        <input
          id="search-input"
          name="search"
          type="search"
          className="filter-input"
          placeholder="ابحث بالاسم أو الوصف أو الرمز..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="البحث في الكتالوج"
        />
      </div>

      <div className="filter-group price-group">
        <div className="price-header">
          <label htmlFor="price-range-input" className="filter-label">
            الحد الأقصى للسعر
          </label>
          <span className="price-display">{maxPrice} ر.س</span>
        </div>
        <input
          id="price-range-input"
          name="priceRange"
          type="range"
          min={50}
          max={6000}
          step={50}
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="filter-range"
          aria-label="الحد الأقصى للسعر"
          aria-valuemin={50}
          aria-valuemax={6000}
          aria-valuenow={maxPrice}
          aria-valuetext={`${maxPrice} ريال سعودي`}
        />
      </div>

      <div className="filter-group sort-group">
        <label htmlFor="sort-select" className="filter-label">
          الترتيب حسب
        </label>
        <select
          id="sort-select"
          name="sort"
          className="filter-select"
          value={sortBy}
          onChange={(e) => {
            const val = e.target.value;
            if (isSortOption(val)) {
              onSortChange(val);
            }
          }}
          aria-label="ترتيب المنتجات"
        >
          <option value="default">الافتراضي (ترتيب الأتيليه)</option>
          <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
          <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
          <option value="rating-desc">الأعلى تقييماً</option>
        </select>
      </div>

      <div className="filter-actions">
        <button
          type="button"
          className="reset-btn"
          onClick={onResetFilters}
          aria-label="إعادة ضبط جميع الفلاتر"
        >
          إعادة ضبط
        </button>
      </div>
    </section>
  );
}

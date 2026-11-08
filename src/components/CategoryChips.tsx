export interface CategoryChipsProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipsProps) {
  return (
    <div className="category-chips-wrap" role="region" aria-label="تصنيفات المنتجات">
      <div className="chips-list">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              className={`chip-btn ${isSelected ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(category)}
              aria-pressed={isSelected}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

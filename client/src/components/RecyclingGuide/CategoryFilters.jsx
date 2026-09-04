function CategoryFilters({ categories, selectedCategory, onSelect }) {
  return (
    <div className="category-filters" aria-label="Filter disposal guidance by category">
      {categories.map((category) => (
        <button
          key={category}
          className={category === selectedCategory ? "category-filters__button category-filters__button--active" : "category-filters__button"}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={category === selectedCategory}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilters;

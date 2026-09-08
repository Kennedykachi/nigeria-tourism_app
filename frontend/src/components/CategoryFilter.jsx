function CategoryFilter({ selected, onSelect }) {
  const categories = [
    { value: '', label: 'All' },
    { value: 'beaches', label: 'Beaches' },
    { value: 'waterfalls', label: 'Waterfalls' },
    { value: 'caves', label: 'Caves' },
    { value: 'mountains-rocks', label: 'Mountains & Rocks' },
    { value: 'woodlands', label: 'Woodlands' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-4 py-2 rounded-full border ${
            selected === cat.value
              ? 'bg-teal-700 text-white border-teal-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
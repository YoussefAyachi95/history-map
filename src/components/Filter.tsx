import { FilterProps } from '@/types';

const Filter= ({ categories, setSelectedCategory, selectedCategory } : FilterProps) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="p-4 h-[80px] flex items-center justify-between bg-[#363636] rounded-xl shadow-lg border-2 border-[#454545]">
      <div className="relative flex w-[20em] h-[3em] rounded-lg overflow-hidden border-2 border-[#454545] font-semibold">
        <select
          className="p-2 outline-none appearance-none border-0 flex-1 text-white bg-[#262626] cursor-pointer"
          name="categoryFilter"
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
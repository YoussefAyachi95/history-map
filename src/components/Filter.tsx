import { useState } from 'react';

type Props = {
  categories: string[];
};

const Filter: React.FC<Props> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div>
      <div>
        <select
          name="categoryFilter"
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
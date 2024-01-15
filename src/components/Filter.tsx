import { useAtom } from 'jotai';
import axios from 'axios';

import { FilterProps } from '@/types';
import { cityAtom, mapCenterAtom } from '@/utils/context/stateAtoms';

import Location from './Location';

const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY

const Filter= ({ categories, setSelectedCategory, selectedCategory } : FilterProps) => {
  const [, setMapCenter] = useAtom(mapCenterAtom);
  const [city, setCity] = useAtom(cityAtom)

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleCenterMapOnMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
  
        try {
          const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`);
          const data = response.data;
  
          if (data.results && data.results.length > 0) {
            const city = data.results[0].components.town;
            setCity(city)
          }
        } catch (error) {
          console.error('Error fetching reverse geocoding data:', error);
        }
      });
    }
  };

  return (
    <div className="p-4 h-[80px] flex items-center justify-between bg-[#363636] rounded-xl shadow-lg border-2 border-[#454545]">
      <Location onClick={handleCenterMapOnMyLocation} city={city} />
      <div className="relative flex w-[20em] h-[3em] rounded-lg overflow-hidden border-2 border-[#454545] font-semibold">
        <select
          className="p-2 outline-none appearance-none border-0 flex-1 text-white bg-[#262626] cursor-pointer"
          name="categoryFilter"
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Show All</option>
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
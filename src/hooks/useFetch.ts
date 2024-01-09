import { useEffect, useState } from 'react';
import axios from 'axios';
import { Place } from '@/types';
import { formatCategory } from '@/utils/formatCategory';

const useFetchPlaces = (defaultPosition: [number, number], API_KEY: string | undefined, API_HOST: string | undefined) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('https://opentripmap-places-v1.p.rapidapi.com/en/places/radius', {
          params: {
            radius: '500',
            lon: defaultPosition[1],
            lat: defaultPosition[0],
          },
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
          },
        });

        const extractedCategories: unknown[] = response.data.features.flatMap((place: any) =>
          place.properties.kinds.split(',')
        );
        
        const uniqueCategories: string[] = Array.from(new Set(extractedCategories as string[])).map(
          (category) => formatCategory(category as string)
        );

        setCategories(uniqueCategories);
        setPlaces(response.data.features);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchPlaces();
  }, [defaultPosition, API_KEY, API_HOST]);

  return { places, categories };
};

export default useFetchPlaces;
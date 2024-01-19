"use client"

import { useEffect, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import Image from 'next/image';
import { useAtom } from 'jotai';

import FlyToMarker from '@/utils/FlyToMarker';
import { Place } from '@/types';
import useFetchPlaces from '@/hooks/useFetch';
import { formatCategory } from '@/utils/formatCategory';
import { cityAtom, mapCenterAtom } from '@/utils/context/stateAtoms';

import Filter from './Filter';
import { FavoritePlaces } from './FavoritePlaces';

import "leaflet/dist/leaflet.css"


const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const API_HOST = process.env.NEXT_PUBLIC_API_HOST


export default function Map() {
    const [mapCenter, ] = useAtom(mapCenterAtom);
    const [city, ] = useAtom(cityAtom)
    const { places, categories } = useFetchPlaces(mapCenter, API_KEY, API_HOST); 
    const [activePlace, setActivePlace] = useState<Place | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [favorites, setFavorites] = useState<String[]>(() => {
      const savedFavs = localStorage.getItem('favorites')
      return savedFavs ? JSON.parse(savedFavs) : []
    })


    const icon: Icon = new Icon({
        iconUrl: "marker.svg",
        iconSize: [25, 41],
        iconAnchor: [12,41]
    })


    const handleFavs = (eventId: string) => {
      let updatedFavs = favorites.filter((id) => id !== eventId)

      if (!favorites.includes(eventId)) {
          updatedFavs = [eventId, ...updatedFavs]
      }

      setFavorites(updatedFavs)
      localStorage.setItem("favorites", JSON.stringify(updatedFavs))
    }

    const handleListItem = (eventId: string) => {
      const place = places.find((item) => item.id === eventId)

      if (place) {
        setActivePlace(place);
      } else {
        console.error("Place not found for ID:", eventId);
      }

    }

    const filteredPlaces = selectedCategory
        ? places.filter(place => {
            const kinds = place.properties.kinds.split(',').map(category => formatCategory(category.trim()));
            const selectedFormattedCategory = formatCategory(selectedCategory.toLowerCase());

            return kinds.some(category => category.toLowerCase() === selectedFormattedCategory.toLowerCase());
        }) : places;

    useEffect(() => {
      setActivePlace(null);
    }, [city]);    


    return (
      <>
          <div className="w-full sm:w-4/5 sm:ml-6">
              <Filter categories={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
          </div>
          <div className="p-6 flex flex-col sm:flex-row h-full w-full gap-6">
            <MapContainer center={mapCenter} zoom={13} className="relative w-full h-full rounded-2xl border-[#363636] border-2">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {
                    filteredPlaces && filteredPlaces.length > 0 &&
                    filteredPlaces.map((place) => (
                        place.geometry && place.geometry.coordinates && place.geometry.coordinates.length === 2 && (
                            <Marker key={place.id} position={[place.geometry.coordinates[1], place.geometry.coordinates[0]]} icon={icon} eventHandlers={{
                              click: () => {
                                setActivePlace(place)
                              }
                            }} />  
                        )
                    ))
                }
                {activePlace && (
                    <Popup position={[activePlace.geometry.coordinates[1], activePlace.geometry.coordinates[0]]}>
                      <div>
                        <h2 className="text-lg font-bold capitalize flex items-center gap-2 mb-2">
                          {activePlace.properties.name}
                        </h2>
                        <button onClick={() => handleFavs(activePlace.id)}>
                            {
                              favorites.includes(activePlace.id) ? 
                                <span className="flex items-center justify-center gap-1 font-semibold">
                                  <Image src={"setFav.svg"} width={25} height={25} alt="Favorite Icon" /> 
                                  Unfavorite
                                </span>
                              : <span className="flex items-center justify-center gap-1 font-semibold">
                                  <Image src={"fav.svg"} width={25} height={25} alt="Favorite Icon" /> 
                                  Favorite
                                </span>
                            }
                        </button>
                      </div>
                  </Popup>
                )}

                {
                  activePlace && <FlyToMarker position={[activePlace.geometry.coordinates[1], activePlace.geometry.coordinates[0]]} zoomLevel={15} />
                }

                {
                  city && <FlyToMarker position={mapCenter} zoomLevel={15} />
                }

            </MapContainer>

            <FavoritePlaces favorites={favorites} handleListItem={handleListItem} places={places} />
        </div>
        </>
    )
}
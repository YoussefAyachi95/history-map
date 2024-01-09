"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import Image from 'next/image';

import FlyToMarker from '@/utils/FlyToMarker';
import { Place } from '@/types';

import "leaflet/dist/leaflet.css"

const defaultPosition: [number, number] = [51.505, -0.09]

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const API_HOST = process.env.NEXT_PUBLIC_API_HOST


export default function Map() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [activePlace, setActivePlace] = useState<Place | null>(null)
    const [favourites, setFavourites] = useState<String[]>(() => {
      const savedFavs = localStorage.getItem('favourites')
      return savedFavs ? JSON.parse(savedFavs) : []
    })

    const icon: Icon = new Icon({
        iconUrl: "marker.svg",
        iconSize: [25, 41],
        iconAnchor: [12,41]
    })

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

    
            setPlaces(response.data.features);
          } catch (error) {
            console.error('Error fetching places:', error);
          }
        };
    
        fetchPlaces();
      }, []);

      const handleFavs = (eventId: string) => {
        let updatedFavs = favourites.filter((id) => id !== eventId)

        if (!favourites.includes(eventId)) {
          updatedFavs = [eventId, ...updatedFavs]
        }

        setFavourites(updatedFavs)
        localStorage.setItem("favourites", JSON.stringify(updatedFavs))
      }

      const handleListItem = (eventId: string) => {
        const place = places.find((item) => item.id === eventId)

        if (place){
          setActivePlace(place)
        }

      }

    return (
        <div className="flex h-full w-full gap-6">
            <div className="h-12"></div>
            <MapContainer center={defaultPosition} zoom={13} className="relative w-full h-full rounded-2xl border-[#363636] border-2">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {
                    places && places.length > 0 &&
                    places.map((place) => (
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
                              favourites.includes(activePlace.id) ? 
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

            </MapContainer>

            <div className="w-1/5 py-4 px-8 rounded-2xl bg-[#262626] shadow-lg border-2 border-[#363636] text-white overflow-y-auto">
              <h2 className="text-xl mb-4 flex items-center gap-1 justify-center font-bold">
                <Image src={"setFav.svg"} width={25} height={25} alt="Favorite Icon" className="animate-bounce" /> 
                Your Favorite Places
              </h2>
              <ul>
                {
                  favourites.map((id) => {
                    return places.find((place) => place.id === id);
                  }).map((place) => (
                    <li 
                      key={place?.id} 
                      className="p-4 mb-4 rounded-lg bg-[#454545] shadow-lg font-medium cursor-pointer"
                      onClick={() => {
                        handleListItem(place?.id as string)
                      }}
                      >
                      <h3>{place?.properties.name}</h3>
                    </li>
                  ))
                }
              </ul>
            </div>
        </div>
    )
}
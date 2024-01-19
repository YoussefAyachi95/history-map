import Image from 'next/image';
import React from 'react'

import { FavoritePlacesProps, Place } from '@/types';



export const FavoritePlaces = ({ favorites, handleListItem, places }: FavoritePlacesProps) => {
    return (
        <div className="w-full sm:w-1/5 py-4 rounded-2xl px-8 bg-[#363636] shadow-lg border-2 border-[#363636] text-white overflow-y-auto">
                <h2 className="text-md lg:text-xl mb-4 flex items-center gap-1 justify-center font-bold">
                    <Image src={"setFav.svg"} width={25} height={25} alt="Favorite Icon" className="animate-bounce" /> 
                    Your Favorite Places
                </h2>
                <ul>
                    {
                    favorites.map((id) => {
                        return places.find((place: Place) => place.id === id);
                    }).map((place) => (
                        <li 
                            key={place?.id} 
                            className="p-4 mb-4 rounded-lg bg-[#454545] shadow-lg font-medium cursor-pointer"
                            onClick={() => {
                                handleListItem(place?.id as string)
                            }}>
                            <h3>{place?.properties.name}</h3>
                        </li>
                    ))
                    }
                </ul>
        </div>
    )
}

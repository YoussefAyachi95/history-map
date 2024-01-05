"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"

import "leaflet/dist/leaflet.css"


const defaultPosition: [number, number] = [51.505, -0.09]

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const API_HOST = process.env.NEXT_PUBLIC_API_HOST


interface Place {
    geometry: {
        coordinates: [number, number]; 
        type: string;
    };
    id: string;
    properties: {
        dist: number;
        kinds: string;
        name: string;
        rate: number;
        wikidata: string;
        xid: string;
        
    };
    type: string;
}

export default function Map() {
    const [places, setPlaces] = useState<Place[]>([]);

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

    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-12"></div>
            <MapContainer center={defaultPosition} zoom={13} className="relative w-full h-full rounded-2xl border-[#363636] border-2">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {
                    places && places.length > 0 &&
                    places.map((place) => (
                        place.geometry && place.geometry.coordinates && place.geometry.coordinates.length === 2 && (
                            <Marker key={place.id} position={[place.geometry.coordinates[1], place.geometry.coordinates[0]]} icon={icon}>
                                <Popup>{place.properties.name}</Popup>
                            </Marker>
                        )
                    ))
                }


            </MapContainer>
        </div>
    )
}
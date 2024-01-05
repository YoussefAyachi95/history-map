"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultPosition: [number, number] = [51.505, -0.09]

type Props = {}

export default function Map({}: Props) {
  return (
    <div className="flex flex-col h-full w-full">
          <div className="h-12"></div>
          <MapContainer center={defaultPosition} zoom={13} className="relative w-full h-full rounded-2xl border-[#363636] border-2">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={defaultPosition}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
          </MapContainer>
    </div>
  )
}
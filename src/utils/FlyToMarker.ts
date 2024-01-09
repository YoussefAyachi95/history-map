import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { FlyToMarkerProps } from '@/types'



export default function FlyToMarker({ position, zoomLevel }: FlyToMarkerProps) {
    const map = useMap()

    useEffect(() => {
        if (position){
            const zoom = zoomLevel ?? map.getZoom()
            map.flyTo(position, zoom, {
                duration: 1
            })
        }
    }, [map, position, zoomLevel])

    return null  
}
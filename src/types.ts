export interface Place {
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

export interface FlyToMarkerProps {
    position: [number, number];
    zoomLevel?: number;
}

export type FilterProps = {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
};
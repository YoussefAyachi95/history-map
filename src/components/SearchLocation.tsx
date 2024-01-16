import React, { useState } from 'react'
import { useAtom } from 'jotai';
import { cityAtom } from '@/utils/context/stateAtoms';

interface SearchLocationProps {
    onSearch: (location: string) => void;
}

export default function SearchLocation({ onSearch }: SearchLocationProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [, setCity] = useAtom(cityAtom)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
        setCity(searchTerm)
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="text"
                placeholder="Enter location..."
                className="p-2 outline-none appearance-none"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        <button onClick={handleSearch} className="p-2 outline-none appearance-none border-0 flex-1 text-white bg-[#262626] cursor-pointer">
            Search
        </button>
    </div>
    )
}
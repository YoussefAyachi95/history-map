import { LocationProps } from '@/types';
import Image from 'next/image';


export default function Location({ onClick, city }: LocationProps) {
    
  return (
    <button
      className="p-2 rounded-md cursor-pointer flex items-center justify-center gap-2 text-white font-semibold"
      onClick={onClick}
    >
        {city ? city : "London"}
      <Image src={"location.svg"} width={30} height={30} alt="Location Icon" /> 
    </button>
  );
}
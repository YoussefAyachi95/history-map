import { atom } from 'jotai';

export const mapCenterAtom = atom<[number, number]>([51.505, -0.09]);
export const cityAtom = atom<string>("London")
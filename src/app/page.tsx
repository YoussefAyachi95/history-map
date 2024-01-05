"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="p-8 h-full w-full">
        <Map />
    </main>
  )
}

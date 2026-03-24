import { AlertTriangle, Compass, MapPinned, Siren } from 'lucide-react';
import Map from './Map.tsx';
import React from 'react';

function MapPage() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-x-4 top-24 z-[900] mx-auto hidden max-w-6xl md:block">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        </div>
      </div>

      <div className="h-full w-full">
        <Map />
      </div>
    </div>
  );
}

export default MapPage;

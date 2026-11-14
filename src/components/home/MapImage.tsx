'use client'
import React from 'react';
import Link from 'next/link';
import { withBase } from '@/lib/paths';
import { visualizationById } from '@/lib/visualizations';

export const MapImage = () => {
    return (
        <Link href="/visuals/map" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
            <span className="font-serif text-lg font-semibold">{visualizationById('map').name}</span>
            <img
              src={withBase("/examples/county-map.png")}
              className="mt-3 h-auto w-full rounded-md bg-white object-contain"
              alt="Colorado counties colored from orange for no to blue for yes, with city labels and a yes share legend"
            />
        </Link>
    );
};

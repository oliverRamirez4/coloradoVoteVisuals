'use client'
import React from 'react';
import Link from 'next/link';
import { withBase } from '@/lib/paths';
import { visualizationById } from '@/lib/visualizations';

export const HistImage = () => {
    return (
        <Link href="/visuals/histogram" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
            <span className="font-serif text-lg font-semibold">{visualizationById('histogram').name}</span>
            <img
              src={withBase("/examples/county-vote-totals.png")}
              className="mt-3 h-auto w-full rounded-md bg-white object-contain"
              alt="Stacked bars of yes votes in blue and no votes in orange for each county"
            />
        </Link>
    );
};

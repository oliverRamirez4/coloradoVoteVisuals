'use client'
import React from 'react';
import Link from 'next/link';
import { withBase } from '@/lib/paths';
import { visualizationById } from '@/lib/visualizations';

export const MarginImage = () => {
  return (
    <Link href="/visuals/margin" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
      <span className="font-serif text-lg font-semibold">{visualizationById('margin').name}</span>
      <img
        src={withBase("/examples/yes-share-ranking.png")}
        className="mt-3 h-auto w-full rounded-md bg-white object-contain"
        alt="Counties ordered from the strongest no to the strongest yes, with a pass line at 50 percent"
      />
    </Link>
  );
};

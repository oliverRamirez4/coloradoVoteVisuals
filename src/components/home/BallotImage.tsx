'use client'
import React from 'react';
import Link from 'next/link';
import { withBase } from '@/lib/paths';
import { visualizationById } from '@/lib/visualizations';

export const BallotImage = () => {
  return (
    <Link href="/visuals/ballot" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
      <span className="font-serif text-lg font-semibold">{visualizationById('ballot').name}</span>
      <img
        src={withBase("/examples/year-ballot.png")}
        className="mt-3 h-auto w-full rounded-md bg-white object-contain"
        alt="Every 2024 ballot measure ordered by statewide yes share, with a pass line at 50 percent"
      />
    </Link>
  );
};

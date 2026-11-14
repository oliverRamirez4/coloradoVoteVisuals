'use client'
import React from 'react';
import Link from 'next/link';
import { withBase } from '@/lib/paths';
import { visualizationById } from '@/lib/visualizations';

export const SplitImage = () => {
  return (
    <Link href="/visuals/split" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
      <span className="font-serif text-lg font-semibold">{visualizationById('split').name}</span>
      <img
        src={withBase("/examples/counties-versus-people.png")}
        className="mt-3 h-auto w-full rounded-md bg-white object-contain"
        alt="A blue bar for the share of votes and an orange bar for the share of counties, with a pass line at 50 percent"
      />
    </Link>
  );
};

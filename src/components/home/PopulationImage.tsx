'use client'
import React from 'react';
import Link from 'next/link';

export const PopulationImage = () => {
  return (
    <Link href="/visuals/population" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
      <span className="font-serif text-lg font-semibold">County Vote Size Map</span>
      <svg viewBox="0 0 160 100" className="mt-3 h-auto w-full rounded-md bg-white" aria-label="Counties drawn as dots sized by votes cast">
        <circle cx="78" cy="42" r="16" fill="#08519c" />
        <circle cx="96" cy="50" r="12" fill="#6baed6" />
        <circle cx="108" cy="68" r="14" fill="#f1a340" />
        <circle cx="36" cy="58" r="10" fill="#b35806" />
        <circle cx="48" cy="36" r="5" fill="#d9d4cc" />
        <circle cx="128" cy="30" r="4" fill="#b35806" />
        <circle cx="22" cy="28" r="3" fill="#6baed6" />
      </svg>
    </Link>
  );
};

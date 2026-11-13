'use client'
import React from 'react';
import Link from 'next/link';
import { withBase } from '@/lib/paths';

export const HistImage = () => {
    return (
        <Link href="/visuals/histogram" className="flex h-full flex-col rounded-lg border border-violet-200 bg-violet-50 p-4 text-gray-900 hover:border-violet-400">
            <span className="font-serif text-lg font-semibold">County Level Pass/Fail Histogram</span>
            <img
              src={withBase("/histogram_2.png")}
              className="mt-3 h-auto w-full rounded-md bg-white object-contain"
              alt="Colorado County Bar Chart"
            />
        </Link>
    );
};

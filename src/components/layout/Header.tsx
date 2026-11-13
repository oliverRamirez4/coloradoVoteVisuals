'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-violet-200 bg-violet-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-xl font-bold text-gray-900 sm:text-2xl">
          Colorado Vote Visuals
        </Link>
        <button
          type="button"
          className="rounded-md border border-violet-300 px-3 py-1 text-sm text-gray-900 md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          Menu
        </button>
        <nav className={`${open ? 'flex' : 'hidden'} w-full flex-col gap-3 text-gray-900 md:flex md:w-auto md:flex-row md:items-center md:gap-6`}>
          <Link href="/" className="hover:underline" onClick={() => setOpen(false)}>Home</Link>
          <details className="relative">
            <summary className="cursor-pointer">Visualizations</summary>
            <div className="mt-2 flex flex-col gap-2 rounded-md border border-violet-200 bg-white p-3 md:absolute md:z-20 md:mt-2 md:min-w-44 md:shadow">
              <Link href="/visuals/map" onClick={() => setOpen(false)}>Map</Link>
              <Link href="/visuals/histogram" onClick={() => setOpen(false)}>Histogram</Link>
              <Link href="/comparison" onClick={() => setOpen(false)}>Comparison</Link>
            </div>
          </details>
          <Link href="/about" className="hover:underline" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" className="hover:underline" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
};

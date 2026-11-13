//'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HistImage } from '@/components/home/HistImage';
import { MapImage } from '@/components/home/MapImage';
import { PropImage } from '@/components/home/PropImage';
import Link from 'next/link';

export const metadata = {
  title: 'Colorado Vote Visualizer',
  description: 'Understanding how votes add up matters. It matters for big races, but it matters for smaller, down ballot races too.',
  // open graph is the preview that shows up when the site is shared
  openGraph: {
    title: 'Colorado Vote Visualizer',
    description: 'Understanding how votes add up matters. It matters for big races, but it matters for smaller, down ballot races too.',
    url: 'https://coloradovotevisuals.com',
    images: [
      {
        url: 'https://coloradocotevisuals.com/preview-image.png',
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function HomePage() {
    return (
      <div className="min-h-screen bg-stone-50 text-gray-900">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">Colorado&apos;s Down-Ballot Data Visualizer</h1>
          <p className="mt-2 text-sm text-stone-600">Explore the State of Colorado’s proposition and amendment races.</p>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7">
            <p>Understanding how votes add up matters. It matters for big races, but it matters for smaller, down-ballot races too.</p>
            <p>The Colorado down-ballot vote visualizer is a tool to be used in the pursuit of understanding down-ballot voting trends in Colorado races. The visualization tools this site offers are meant to lend a hand to journalists covering these races and to voters seeking more information about how support for state-level issues has changed over time.</p>
            <p>The County Level Pass/Fail Density Map allows users to search by year and proposition to see the density of support for a given proposition by county. The Proposition Comparison visualizer allows users to pick two separate years and two propositions within those years. This visualization aims to support users comparing two similar propositions on a county level to see how the level of support within counties has changed over time. The County Level Pass/Fail Histogram visualization allows users another way to think about county level support for propositions.</p>
            <p>These visualizations can be exported in their entirety and used in local election reporting. All the data for these visualizations comes from the Colorado Secretary of State’s elections data. Find out more about how this data was sourced<Link href="/about" className="text-blue-700 hover:underline"> here</Link>.</p>
          </div>
          <h2 className="mt-10 font-serif text-2xl">Explore different visualizations</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <MapImage/>
            <PropImage/>
            <HistImage/>
          </div>
        </main>
        <Footer/>
      </div>
      

    );
};

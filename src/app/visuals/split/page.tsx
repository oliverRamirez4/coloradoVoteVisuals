import SplitFunction from '@/app/visuals/split/SplitFunction';

export const metadata = {
  title: 'Colorado Vote Visualizer',
  description: 'Compare the share of counties that voted yes with the share of votes that were yes.',
  openGraph: {
    title: 'Colorado Vote Visualizer: Counties versus People',
    description: 'See whether a measure won the counties, the votes, or both.',
    url: 'https://www.coloradovotevisuals.com/visuals/split',
  },
};

export default function SplitPage() {
  return <SplitFunction />;
}

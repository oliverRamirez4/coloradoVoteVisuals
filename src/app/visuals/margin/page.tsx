import MarginFunction from '@/app/visuals/margin/MarginFunction';

export const metadata = {
  title: 'Colorado Vote Visualizer',
  description: 'Counties ranked by the share of votes cast in favor of a ballot measure.',
  openGraph: {
    title: 'Colorado Vote Visualizer: County Ranking',
    description: 'Counties ordered from the strongest no to the strongest yes.',
    url: 'https://www.coloradovotevisuals.com/visuals/margin',
    images: [
      {
        url: 'https://coloradocotevisuals.com/preview-image.png',
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function MarginPage() {
  return <MarginFunction />;
}

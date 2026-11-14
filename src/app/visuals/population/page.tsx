import PopulationFunction from '@/app/visuals/population/PopulationFunction';

export const metadata = {
  title: 'Colorado Vote Visualizer',
  description: 'See how many votes each Colorado county cast, colored by whether the county voted yes or no.',
  openGraph: {
    title: 'Colorado Vote Visualizer: Population Map',
    description: 'County dots sized by votes cast and colored by yes share.',
    url: 'https://www.coloradovotevisuals.com/visuals/population',
    images: [
      {
        url: 'https://coloradocotevisuals.com/preview-image.png',
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function PopulationPage() {
  return <PopulationFunction />;
}

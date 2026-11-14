import BallotFunction from '@/app/visuals/ballot/BallotFunction';

export const metadata = {
  title: 'Colorado Vote Visualizer',
  description: 'Statewide yes share for every measure on the ballot in one year.',
  openGraph: {
    title: 'Colorado Vote Visualizer: Year Ballot',
    description: 'See which measures passed comfortably and which ones landed on the line.',
    url: 'https://www.coloradovotevisuals.com/visuals/ballot',
  },
};

export default function BallotPage() {
  return <BallotFunction />;
}

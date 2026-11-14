export const visualizations = [
  {
    id: 'map',
    href: '/visuals/map',
    name: 'County map',
    detail: 'How each county voted, colored by yes share.',
  },
  {
    id: 'population',
    href: '/visuals/population',
    name: 'Vote size map',
    detail: 'Each county is a dot sized by votes cast and colored by yes share.',
  },
  {
    id: 'margin',
    href: '/visuals/margin',
    name: 'Yes share ranking',
    detail: 'Counties ordered from the strongest no to the strongest yes.',
  },
  {
    id: 'split',
    href: '/visuals/split',
    name: 'Counties versus people',
    detail: 'The share of votes that were yes, next to the share of counties that voted yes.',
  },
  {
    id: 'ballot',
    href: '/visuals/ballot',
    name: 'Year ballot',
    detail: 'Statewide yes share for every measure in the selected year.',
  },
  {
    id: 'histogram',
    href: '/visuals/histogram',
    name: 'County vote totals',
    detail: 'Yes and no votes stacked for each county.',
  },
  {
    id: 'comparison',
    href: '/comparison',
    name: 'Compare two measures',
    detail: 'Yes share in each county for two propositions.',
  },
] as const;

export type VisualizationId = (typeof visualizations)[number]['id'];

export function visualizationById(id: VisualizationId) {
  return visualizations.find((view) => view.id === id)!;
}

export function visualizationByPath(pathname: string) {
  return visualizations.find((view) => pathname.includes(view.href));
}

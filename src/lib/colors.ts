import * as d3 from 'd3';

export const NO_STRONG = '#b35806';
export const NO_MID = '#f1a340';
export const PASS_LINE = '#d9d4cc';
export const YES_MID = '#6baed6';
export const YES_STRONG = '#08519c';

export function yesShareColor(share: number, threshold = 50) {
  return d3.scaleLinear<string>()
    .domain([
      0,
      threshold / 2,
      threshold,
      threshold + (100 - threshold) / 2,
      100,
    ])
    .range([NO_STRONG, NO_MID, PASS_LINE, YES_MID, YES_STRONG])
    .clamp(true)(share);
}

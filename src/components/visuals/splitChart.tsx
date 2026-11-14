'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { NO_STRONG, YES_STRONG } from '@/lib/colors';

export function SplitChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const selected = useContext(SelectedPropContext);
  const votes = selected?.votes ?? [];
  const threshold = selected?.passed_percentage ?? 50;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(280, Math.floor(node.clientWidth)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  let yes = 0;
  let no = 0;
  let counties = 0;
  let countiesYes = 0;
  votes.forEach((vote) => {
    const yesCount = vote.yes_count || 0;
    const noCount = vote.no_count || 0;
    const cast = yesCount + noCount;
    if (cast === 0) return;
    yes += yesCount;
    no += noCount;
    counties += 1;
    if ((yesCount / cast) * 100 > threshold) countiesYes += 1;
  });

  const peopleShare = yes + no === 0 ? null : (yes / (yes + no)) * 100;
  const countyShare = counties === 0 ? null : (countiesYes / counties) * 100;

  const labelWidth = width < 420 ? 78 : 96;
  const percentWidth = 52;
  const barX = labelWidth;
  const barWidth = Math.max(80, width - labelWidth - percentWidth);
  const height = 168;
  const rows = [
    { label: 'People', share: peopleShare, detail: 'of votes' },
    { label: 'Counties', share: countyShare, detail: 'of counties' },
  ];

  const summary = peopleShare === null || countyShare === null
    ? 'Select a proposition to compare counties and voters.'
    : describeSplit(peopleShare, countyShare, threshold);

  return (
    <div ref={containerRef} className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Counties versus people">
        <text x="0" y="18" fontSize="14" fontWeight="700" fill="#333">Counties versus people</text>
        <line
          x1={barX + (barWidth * threshold) / 100}
          x2={barX + (barWidth * threshold) / 100}
          y1="36"
          y2="132"
          stroke="#111"
          strokeWidth="1.25"
          strokeDasharray="3 3"
        />
        {rows.map((row, index) => {
          const y = 48 + index * 44;
          const share = row.share ?? 0;
          return (
            <g key={row.label}>
              <text x="0" y={y + 14} fontSize="13" fontWeight="600" fill="#333">{row.label}</text>
              <text x="0" y={y + 30} fontSize="11" fill="#57534e">{row.detail}</text>
              <rect x={barX} y={y} width={barWidth} height="22" rx="3" fill="#f4f2ef" />
              {row.share !== null && (
                <rect
                  x={barX}
                  y={y}
                  width={Math.max(2, (barWidth * share) / 100)}
                  height="22"
                  rx="3"
                  fill={share > threshold ? YES_STRONG : NO_STRONG}
                />
              )}
              <text x={barX + barWidth + 8} y={y + 15} fontSize="12" fill="#333">
                {row.share === null ? '—' : `${row.share.toFixed(1)}%`}
              </text>
            </g>
          );
        })}
        <text x={barX} y="156" fontSize="11" fill="#333">0%</text>
        <text x={barX + (barWidth * threshold) / 100} y="156" textAnchor="middle" fontSize="11" fill="#333">{`${threshold}%`}</text>
        <text x={barX + barWidth} y="156" textAnchor="end" fontSize="11" fill="#333">100%</text>
      </svg>
      <p className="mt-2 text-sm text-stone-700">{summary}</p>
    </div>
  );
}

function describeSplit(peopleShare: number, countyShare: number, threshold: number) {
  const people = peopleShare > threshold;
  const counties = countyShare > threshold;
  if (people && counties) return 'Voters and most counties were over the pass line.';
  if (!people && !counties) return 'Voters and most counties were under the pass line.';
  if (people) return 'Voters were over the pass line. Most counties were not.';
  return 'Most counties were over the pass line. Voters were not.';
}

'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { Proposition } from '@/types/propdata';
import { withBase } from '@/lib/paths';
import { yesShareColor } from '@/lib/colors';

type BallotRow = {
  id: number;
  name: string;
  shortName: string;
  share: number;
  threshold: number;
  yes: number;
  no: number;
};

export function BallotChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [rows, setRows] = useState<BallotRow[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const selected = useContext(SelectedPropContext);
  const router = useRouter();
  const year = selected?.year;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(280, Math.floor(node.clientWidth)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!year) {
      setRows([]);
      setStatus('idle');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    fetch(withBase(`/api/propositions/years/${year}`))
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load the ballot');
        return response.json() as Promise<Proposition[]>;
      })
      .then((propositions) => {
        if (cancelled) return;
        setRows(propositions.map(toRow).sort((a, b) => a.share - b.share || a.name.localeCompare(b.name)));
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [year]);

  const labelWidth = width < 420 ? 112 : 132;
  const percentWidth = 52;
  const barX = labelWidth;
  const barWidth = Math.max(80, width - labelWidth - percentWidth);
  const rowHeight = 28;
  const height = 52 + Math.max(rows.length, 1) * rowHeight;

  return (
    <div ref={containerRef} className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label={`Ballot measures in ${year ?? 'the selected year'}`}>
        <text x="0" y="16" fontSize="14" fontWeight="700" fill="#333">
          {year ? `Year ballot · ${year}` : 'Year ballot'}
        </text>
        {status === 'ready' && rows.length > 0 && (
          <line
            x1={barX + barWidth / 2}
            x2={barX + barWidth / 2}
            y1="28"
            y2={height - 8}
            stroke="#111"
            strokeWidth="1.25"
            strokeDasharray="3 3"
          />
        )}
        {rows.map((row, index) => {
          const y = 36 + index * rowHeight;
          const selectedRow = row.id === selected?.id;
          return (
            <g
              key={row.id}
              className="cursor-pointer"
              onClick={() => router.push(`/visuals/map?proposition_id=${row.id}`)}
            >
              <title>{`${row.name}: ${row.share.toFixed(1)}% yes. Open the county map.`}</title>
              <text
                x="0"
                y={y + 14}
                fontSize="12"
                fontWeight={selectedRow ? 700 : 500}
                fill="#333"
              >
                {fitLabel(row.shortName, labelWidth)}
              </text>
              <rect x={barX} y={y} width={barWidth} height="16" rx="3" fill="#f4f2ef" />
              <rect
                x={barX}
                y={y}
                width={Math.max(2, (barWidth * row.share) / 100)}
                height="16"
                rx="3"
                fill={yesShareColor(row.share, row.threshold)}
                stroke={selectedRow ? '#111' : 'none'}
                strokeWidth={selectedRow ? 1.5 : 0}
              />
              <text x={barX + barWidth + 8} y={y + 12} fontSize="11" fill="#333">
                {`${row.share.toFixed(0)}%`}
              </text>
            </g>
          );
        })}
      </svg>
      {status === 'loading' && <p className="text-sm text-stone-600">Loading the ballot…</p>}
      {status === 'error' && <p className="text-sm text-stone-700">The ballot for this year could not be loaded.</p>}
      {status === 'idle' && <p className="text-sm text-stone-600">Select a proposition. This chart uses that measure’s year.</p>}
      {status === 'ready' && (
        <p className="mt-2 text-sm text-stone-700">Each bar is the statewide yes share. Select a measure to open its county map.</p>
      )}
    </div>
  );
}

function toRow(proposition: Proposition): BallotRow {
  let yes = 0;
  let no = 0;
  proposition.votes.forEach((vote) => {
    yes += vote.yes_count || 0;
    no += vote.no_count || 0;
  });
  const cast = yes + no;
  const head = proposition.name.split(' - ')[0] || proposition.name;
  const shortName = head.replace(/\s*\([^)]*\)\s*$/, '');
  return {
    id: proposition.id,
    name: proposition.name,
    shortName,
    share: cast === 0 ? 0 : (yes / cast) * 100,
    threshold: proposition.passed_percentage ?? 50,
    yes,
    no,
  };
}

function fitLabel(label: string, width: number) {
  const maxChars = Math.max(12, Math.floor(width / 7));
  if (label.length <= maxChars) return label;
  return `${label.slice(0, maxChars - 1)}…`;
}

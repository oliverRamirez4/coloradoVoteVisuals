'use client'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { VisualizationId, visualizations } from '@/lib/visualizations';

type Props = {
  propId: number;
}

export default function VisualizationSelect(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const selected = visualizations.find((view) => pathname.includes(view.href))?.id ?? null;

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: VisualizationId | null,
  ) => {
    if (next === null) return;
    const view = visualizations.find((item) => item.id === next);
    if (!view) return;
    const query = view.id === 'comparison'
      ? `proposition1_id=${props.propId}`
      : `proposition_id=${props.propId}`;
    router.push(props.propId === 0 ? view.href : `${view.href}/?${query}`);
  };

  return (
    <ToggleButtonGroup
      className="flex w-full flex-col"
      orientation="vertical"
      exclusive
      color="primary"
      value={selected}
      onChange={handleChange}
      aria-label="Visualization"
    >
      {visualizations.map((view) => (
        <ToggleButton
          key={view.id}
          value={view.id}
          className="w-full justify-start px-3 py-2 text-left text-sm"
          sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
        >
          {view.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

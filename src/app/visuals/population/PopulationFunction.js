'use client';
import { ColoradoMap } from '@/components/visuals/D3Map';
import React from 'react';
import { SelectedPropContext } from '@/context/SelectedPropContext';

export default function PopulationFunction() {
  return (
    <ColoradoMap propositionId={1} year={2020} voteData={SelectedPropContext.votes} variant="population" />
  );
}

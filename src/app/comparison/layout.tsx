'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropositionFilters } from '@/components/filtering/PropositionFilters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Proposition } from '@/types/propdata';
import VisualizationSelect from '@/components/vizSelect/VisualizationSelect';
import { ExportModal } from '@/components/export/ExportModal';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { ComparePropContext } from '@/context/ComparePropContext';
import { visualizationById } from '@/lib/visualizations';
import { fetchProposition } from '@/lib/propositions';

function ComparisonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedProp1, setSelectedProp1] = useState<Proposition | null>(null);
  const [selectedProp2, setSelectedProp2] = useState<Proposition | null>(null);
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const proposition1Id = searchParams.get('proposition1_id');
  const proposition2Id = searchParams.get('proposition2_id');

  useEffect(() => {
    let cancelled = false;
    if (proposition1Id) {
      fetchProposition(proposition1Id).then((prop) => {
        if (!cancelled && prop) setSelectedProp1(prop);
      });
    }
    if (proposition2Id) {
      fetchProposition(proposition2Id).then((prop) => {
        if (!cancelled && prop) setSelectedProp2(prop);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [proposition1Id, proposition2Id]);

  useEffect(() => {
    if (!selectedProp1 && !selectedProp2) return;
    const params = new URLSearchParams(window.location.search);
    if (selectedProp1) params.set('proposition1_id', String(selectedProp1.id));
    if (selectedProp2) params.set('proposition2_id', String(selectedProp2.id));
    if (isEmbed) params.set('embed', 'true');
    const next = `?${params.toString()}`;
    if (next !== window.location.search) window.history.pushState({}, '', next);
  }, [selectedProp1, selectedProp2, isEmbed]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const chart = (
    <SelectedPropContext.Provider value={selectedProp1}>
      <ComparePropContext.Provider value={selectedProp2}>
        {children}
      </ComparePropContext.Provider>
    </SelectedPropContext.Provider>
  );

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div id="export-container" className="w-full p-3">
          <div className="h-[34rem]">{chart}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <h1 className="font-serif text-2xl sm:text-3xl">{visualizationById('comparison').name}</h1>
          <p className="mt-1 text-sm text-stone-600">{visualizationById('comparison').detail}</p>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="min-w-0 md:col-span-3">
            <Card className="flex min-h-[28rem] flex-col justify-center overflow-x-auto">
              <div id="export-container" className="h-[32rem]">
              {chart}
              </div>
              
  
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <PropositionFilters
                setSelectedProp={setSelectedProp1}
                slugName={'proposition1_id'}
              />
            </Card>
            <Card className="p-4">
              <PropositionFilters
                setSelectedProp={setSelectedProp2}
                slugName={'proposition2_id'}
              />
            </Card>
            
            <Card>
                <VisualizationSelect propId = {selectedProp1 ? selectedProp1.id : 0} />
            </Card>
            <Card>
              <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={() => setIsModalOpen(true)}>
                Export
              </Button>
              </div>
            </Card>
          </div>
        </div>
        <Footer/>
      </main>
      <ExportModal isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      selectedProp={selectedProp1} 
      />
    </div>
  );
}

export default function visualLayoutRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <ComparisonLayout>{children}</ComparisonLayout>
    </Suspense>
  );
}
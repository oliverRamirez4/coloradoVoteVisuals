'use client';
import React, { Suspense, useState, useEffect, createContext } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropositionFilters } from '@/components/filtering/PropositionFilters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResultDisplay } from '@/components/results/ResultDisplay';
import { Proposition, VoteData } from '@/types/propdata';
import VisualizationSelect from '@/components/vizSelect/VisualizationSelect';
import { ExportModal } from '@/components/export/ExportModal';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { useSearchParams } from 'next/navigation';

function VisualLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedProp, setSelectedProp] = useState<Proposition | null>(null);
  const [totalYesVotes, setTotalYesVotes] = useState<number>(0);
  const [totalNoVotes, setTotalNoVotes] = useState<number>(0);

  // Calculate totals when voteData changes
  useEffect(() => {
    const sumVotes = () => {
      if (!selectedProp) return { totalYes: 0, totalNo: 0 };

      let totalYes = 0;
      let totalNo = 0;

      selectedProp.votes.forEach((vote) => {
        totalYes += vote.yes_count;
        totalNo += vote.no_count;
      });

      return { totalYes, totalNo };
    };

    const totals = sumVotes();
    setTotalYesVotes(totals.totalYes);
    setTotalNoVotes(totals.totalNo);
  }, [selectedProp]);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const propositionId = searchParams.get('proposition_id');



  useEffect(() => {
    // update URL and voteData when the proposition is selected from dropdown
    if (selectedProp) {
      const newUrl = isEmbed
        ? `?proposition_id=${selectedProp.id}&embed=true`
        : `?proposition_id=${selectedProp.id}`;

      window.history.pushState({}, '', newUrl);
    }
  }, [selectedProp, isEmbed]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {isEmbed ? (
        <div id="export-container" className="w-full h-full">
          <SelectedPropContext.Provider value={selectedProp}>
            {children}
          </SelectedPropContext.Provider>
        </div>
      ) : (
        <>
          <Header />
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
            <h1 className="font-serif text-2xl sm:text-3xl">Visualization Generator</h1>
            <p className="mt-1 text-sm text-stone-600">Compare the percentages of people voting for propositions in each county.</p>
          </div>
          <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="min-w-0 md:col-span-3">
                <Card className="flex min-h-[24rem] flex-col overflow-x-auto p-4">
                  <div id="export-container">
                    <SelectedPropContext.Provider value={selectedProp}>

                      {children}

                    </SelectedPropContext.Provider>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="p-4">
                  <PropositionFilters setSelectedProp={setSelectedProp} slugName={'proposition_id'} />
                </Card>
                <Card>
                  <ResultDisplay yesTotal={totalYesVotes} noTotal={totalNoVotes} />
                </Card>
                {selectedProp ? selectedProp.passed ? <Card>This legislation passed</Card> : <Card>This legislation did not pass </Card>: ''}
                <Card>
                  <VisualizationSelect propId={selectedProp ? selectedProp.id : 0} />
                </Card>
                <Card>
                  <div className="space-y-2">
                    <Button variant="primary" className="w-full" onClick={() => setIsModalOpen(true)}>
                      Export Map
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
            <Card className="mt-4">
              <div className='title'>{selectedProp?.name}</div>
              <div>{selectedProp?.description}</div>
            </Card>
            <Footer />
          </main>
          <ExportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedProp={selectedProp}
          />
        </>
      )}
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
      <VisualLayout>{children}</VisualLayout>
    </Suspense>
  );
}

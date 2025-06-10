import React, { useState } from 'react';
import IntegratedImageViewer from '@/components/IntegratedImageViewer/IntegratedImageViewer';
import { caseOptions } from '@/data/curated-cases';

export default function IntegratedViewerPage() {
  const [selectedCase, setSelectedCase] = useState<string>(caseOptions[0]?.name || 'Gas Bubbles on SWI');

  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId);
  };

  return (
    <IntegratedImageViewer 
      selectedCase={selectedCase}
      onCaseSelect={handleCaseSelect}
    />
  );
}
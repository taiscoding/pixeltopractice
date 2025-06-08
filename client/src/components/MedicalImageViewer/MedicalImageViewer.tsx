import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { imageData, getCaseKey } from '@/data/imageData';
import { availableCases } from '@/data/curated-cases';

interface MedicalImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCase: string;
}

export default function MedicalImageViewer({ isOpen, onClose, selectedCase }: MedicalImageViewerProps) {
  const [currentModality, setCurrentModality] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Get case data
  const caseKey = getCaseKey(selectedCase);
  const caseImageData = imageData[caseKey as keyof typeof imageData];
  const currentCaseData = availableCases[selectedCase];

  // Initialize modality and view when viewer opens
  useEffect(() => {
    if (isOpen && caseImageData) {
      setCurrentModality(caseImageData.defaultModality);
      setCurrentView(caseImageData.defaultView);
    }
  }, [isOpen, caseImageData]);

  // Handle modality change
  const handleModalityChange = (modality: string) => {
    setCurrentModality(modality);
    // Set first view of the new modality as default
    const modalityData = (caseImageData.modalities as any)[modality];
    if (modalityData) {
      const firstView = Object.keys(modalityData)[0];
      setCurrentView(firstView);
    }
  };

  // Handle view change
  const handleViewChange = (view: string) => {
    setIsImageLoading(true);
    setCurrentView(view);
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Get current image path
  const getCurrentImagePath = () => {
    if (!currentModality || !currentView || !caseImageData.modalities[currentModality]) {
      return '';
    }
    return caseImageData.modalities[currentModality][currentView] || '';
  };

  // Get available views for current modality
  const getAvailableViews = () => {
    if (!currentModality || !caseImageData.modalities[currentModality]) {
      return [];
    }
    return Object.keys(caseImageData.modalities[currentModality]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Top Bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 z-60 bg-black/80 backdrop-blur-xl border-b border-gray-800"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-white">
                  {currentCaseData?.case?.caseName || selectedCase}
                </h1>
                <div className="h-6 w-px bg-gray-600" />
                <div className="text-sm text-gray-300">
                  Medical Image Viewer
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-orange-400 font-medium">
                  {currentModality}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="pt-20 pb-6 px-6 h-full flex" onClick={(e) => e.stopPropagation()}>
            {/* Left Panel - Modality Selection */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-80 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-6 mr-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">Imaging Modalities</h3>
              
              <div className="space-y-3 mb-6">
                {Object.keys(caseImageData.modalities).map((modality) => (
                  <button
                    key={modality}
                    onClick={() => handleModalityChange(modality)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border ${
                      currentModality === modality
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium">{modality}</div>
                  </button>
                ))}
              </div>

              {/* View Selection */}
              {currentModality && (
                <div>
                  <h4 className="text-md font-medium text-white mb-3">Views</h4>
                  <div className="space-y-2">
                    {getAvailableViews().map((view) => (
                      <button
                        key={view}
                        onClick={() => handleViewChange(view)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          currentView === view
                            ? 'bg-orange-500/30 text-orange-200 border border-orange-500/50'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Patient Context */}
              {currentCaseData?.case?.caseName === 'Gas Bubbles on SWI' && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-md font-medium text-white mb-3">Patient Context</h4>
                  <div className="space-y-3 text-sm">
                    <div className="text-gray-300">
                      <span className="text-blue-400">Patient:</span> 65-year-old male
                    </div>
                    <div className="text-gray-300">
                      <span className="text-green-400">Status:</span> Post-operative (posterior fossa mass excision)
                    </div>
                    <div className="text-gray-300">
                      <span className="text-orange-400">Finding:</span> Expected gas bubbles
                    </div>
                  </div>
                </div>
              )}

              {currentCaseData?.case?.caseName === 'Trauma Gas' && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-md font-medium text-white mb-3">Patient Context</h4>
                  <div className="space-y-3 text-sm">
                    <div className="text-gray-300">
                      <span className="text-red-400">Emergency:</span> Skull fracture
                    </div>
                    <div className="text-gray-300">
                      <span className="text-yellow-400">Risk:</span> Venous thrombosis
                    </div>
                    <div className="text-gray-300">
                      <span className="text-purple-400">Location:</span> Lambdoid suture
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Main Image Area */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 bg-black/30 backdrop-blur-xl border border-gray-800 rounded-lg overflow-hidden relative"
            >
              {/* Tab Bar */}
              <div className="bg-gray-900/80 border-b border-gray-700 px-6 py-3">
                <div className="flex items-center gap-1">
                  {getAvailableViews().map((view) => (
                    <button
                      key={view}
                      onClick={() => handleViewChange(view)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentView === view
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Display */}
              <div className="relative h-full flex items-center justify-center p-6">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {getCurrentImagePath() ? (
                  <motion.img
                    key={getCurrentImagePath()}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={getCurrentImagePath()}
                    alt={`${currentModality} - ${currentView}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onLoad={handleImageLoad}
                    onError={() => setIsImageLoading(false)}
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    <div className="text-lg mb-2">No image available</div>
                    <div className="text-sm">Please select a different view</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
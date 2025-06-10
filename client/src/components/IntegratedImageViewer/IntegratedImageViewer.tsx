import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { imageData, getCaseKey, type CaseImageData } from '@/data/imageData';
import { availableCases, caseOptions } from '@/data/curated-cases';

interface IntegratedImageViewerProps {
  selectedCase: string;
  onCaseSelect: (caseId: string) => void;
}

type LearningMode = 'technical' | 'clinical' | 'anatomical';
type ComparisonMode = 'single' | 'sequences' | 'cases';

type LearningLevel = 'discovery' | 'focused' | 'clinical' | 'comprehensive';

export default function IntegratedImageViewer({ selectedCase, onCaseSelect }: IntegratedImageViewerProps) {
  const [learningMode, setLearningMode] = useState<LearningMode>('technical');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('discovery');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('single');
  const [currentModality, setCurrentModality] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>('');
  const [currentModality2, setCurrentModality2] = useState<string>('');
  const [currentView2, setCurrentView2] = useState<string>('');
  const [comparisonCase, setComparisonCase] = useState<string>('');
  const [sequenceComparison, setSequenceComparison] = useState<string>('SWI vs T2');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLearningPanelHovered, setIsLearningPanelHovered] = useState(false);

  // Get case data
  const caseKey = getCaseKey(selectedCase);
  const caseImageData = imageData[caseKey as keyof typeof imageData];
  const currentCaseData = availableCases[selectedCase];

  // Get comparison case data
  const comparisonCaseKey = getCaseKey(comparisonCase);
  const comparisonImageData = comparisonCase ? imageData[comparisonCaseKey as keyof typeof imageData] : null;
  const comparisonCaseData = comparisonCase ? availableCases[comparisonCase] : null;

  // Initialize modality and view when viewer opens
  useEffect(() => {
    if (caseImageData) {
      setCurrentModality(caseImageData.defaultModality);
      setCurrentView(caseImageData.defaultView);
      
      // Set up default comparison sequence
      if (comparisonMode === 'sequences') {
        const modalities = Object.keys(caseImageData.modalities);
        if (modalities.includes('SWI') && modalities.includes('T2')) {
          setCurrentModality('SWI');
          setCurrentModality2('T2');
          setCurrentView(caseImageData.defaultView);
          setCurrentView2(caseImageData.defaultView);
        }
      }
    }
  }, [caseImageData, comparisonMode]);

  // Handle learning mode change
  const handleLearningModeChange = (mode: LearningMode) => {
    setLearningMode(mode);
    setLearningLevel('discovery'); // Reset to discovery when switching tabs
  };

  // Handle learning level change
  const handleLearningLevelChange = (level: LearningLevel) => {
    setLearningLevel(level);
  };

  // Handle comparison mode change
  const handleComparisonModeChange = (mode: ComparisonMode) => {
    setComparisonMode(mode);
    if (mode === 'cases' && !comparisonCase) {
      // Set default comparison case
      const otherCases = caseOptions.filter(c => c.name !== selectedCase);
      if (otherCases.length > 0) {
        setComparisonCase(otherCases[0].name);
      }
    }
  };

  // Handle sequence comparison change
  const handleSequenceComparisonChange = (comparison: string) => {
    setSequenceComparison(comparison);
    if (caseImageData) {
      const [mod1, mod2] = comparison.split(' vs ');
      const modalities = Object.keys(caseImageData.modalities);
      if (modalities.includes(mod1) && modalities.includes(mod2)) {
        setCurrentModality(mod1);
        setCurrentModality2(mod2);
        setCurrentView(caseImageData.defaultView);
        setCurrentView2(caseImageData.defaultView);
      }
    }
  };

  // Get current image path
  const getCurrentImagePath = (isSecondImage = false) => {
    let modality, view, imageDataToUse;
    
    if (isSecondImage && comparisonMode === 'cases') {
      // For case comparison, use comparison case data
      imageDataToUse = comparisonImageData;
      modality = currentModality;
      view = currentView;
      
      // Initialize modality and view for comparison case if not set
      if (comparisonImageData && (!currentModality || !Object.keys(comparisonImageData.modalities).includes(currentModality))) {
        modality = comparisonImageData.defaultModality;
        view = comparisonImageData.defaultView;
      }
    } else if (isSecondImage && comparisonMode === 'sequences') {
      // For sequence comparison, use same case data but different modality
      modality = currentModality2;
      view = currentView2;
      imageDataToUse = caseImageData;
    } else {
      // Primary image
      modality = currentModality;
      view = currentView;
      imageDataToUse = caseImageData;
    }

    if (!modality || !view || !imageDataToUse) {
      return '';
    }
    const modalityData = imageDataToUse.modalities[modality];
    if (!modalityData) return '';
    return modalityData[view] || '';
  };

  // Get learning content based on mode and level
  const getLearningContent = () => {
    if (!currentCaseData?.case?.framework) return null;

    const framework = currentCaseData.case.framework;
    const modeData = framework[learningMode.toUpperCase() as keyof typeof framework];

    if (!modeData) return null;

    return {
      primaryConcept: modeData.primaryConcept,
      discoveryInsight: modeData.discoveryInsight,
      focusedLearning: modeData.focusedLearning,
      clinicalApplication: modeData.clinicalApplication,
      comprehensiveAnalysis: modeData.comprehensiveAnalysis
    };
  };

  // Get content for current learning level
  const getCurrentLevelContent = () => {
    const content = getLearningContent();
    if (!content) return null;

    switch (learningLevel) {
      case 'discovery':
        return {
          title: 'Discovery Insight',
          content: content.discoveryInsight,
          bgColor: 'bg-blue-950/30',
          textColor: 'text-blue-200'
        };
      case 'focused':
        return {
          title: 'Focused Learning',
          content: content.focusedLearning,
          bgColor: 'bg-green-950/30',
          textColor: 'text-green-200'
        };
      case 'clinical':
        return {
          title: 'Clinical Application',
          content: content.clinicalApplication,
          bgColor: 'bg-orange-950/30',
          textColor: 'text-orange-200'
        };
      case 'comprehensive':
        return {
          title: 'Comprehensive Analysis',
          content: content.comprehensiveAnalysis,
          bgColor: 'bg-purple-950/30',
          textColor: 'text-purple-200'
        };
      default:
        return null;
    }
  };

  // Format text content
  const formatText = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span className="text-orange-400 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: line.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        );
      }
      
      // Handle bold text and regular paragraphs
      return (
        <p key={index} className="mb-3" dangerouslySetInnerHTML={{ 
          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
        }} />
      );
    });
  };

  // Get learning mode label
  const getLearningModeLabel = (mode: LearningMode) => {
    switch (mode) {
      case 'technical': return 'Technical Analysis';
      case 'clinical': return 'Clinical Significance';
      case 'anatomical': return 'Anatomical Context';
      default: return 'Analysis';
    }
  };

  // Get patient context
  const getPatientContext = () => {
    if (currentCaseData?.case?.caseName === 'Gas Bubbles on SWI') {
      return {
        patient: '65-year-old male',
        presentation: 'Immediately post-posterior fossa surgery',
        finding: 'Expected gas bubbles'
      };
    } else if (currentCaseData?.case?.caseName === 'Trauma Gas') {
      return {
        patient: '20-year-old male',
        presentation: 'Fall from bike',
        finding: 'Skull fracture crossing suture'
      };
    }
    return null;
  };

  const learningContent = getLearningContent();
  const currentLevelContent = getCurrentLevelContent();
  const patientContext = getPatientContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Learning Level Peek Panel */}
      <div 
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50"
        onMouseEnter={() => setIsLearningPanelHovered(true)}
        onMouseLeave={() => setIsLearningPanelHovered(false)}
      >
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: isLearningPanelHovered ? 0 : -175 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-r-lg shadow-2xl"
        >
          <div className="p-4">
            {!isLearningPanelHovered ? (
              <div className="text-orange-400 text-sm font-medium writing-mode-vertical transform rotate-180">
                Learning Levels
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-orange-400 text-sm font-medium mb-3">Learning Levels</div>
                {(['discovery', 'focused', 'clinical', 'comprehensive'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLearningLevelChange(level)}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-left ${
                      learningLevel === level
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Navigation Bar */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-white">
              {currentCaseData?.case?.caseName || selectedCase}
            </h1>
            
            {/* Case Selector */}
            <Select value={selectedCase} onValueChange={onCaseSelect}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {caseOptions.map((caseOption) => (
                  <SelectItem key={caseOption.name} value={caseOption.name}>
                    {caseOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Learning Mode Tabs */}
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              {(['technical', 'clinical', 'anatomical'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleLearningModeChange(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    learningMode === mode
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Controls */}
          <div className="flex items-center gap-4">
            {comparisonMode === 'sequences' && (
              <Select value={sequenceComparison} onValueChange={handleSequenceComparisonChange}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SWI vs T2">SWI vs T2</SelectItem>
                  <SelectItem value="SWI vs FLAIR">SWI vs FLAIR</SelectItem>
                  <SelectItem value="T2 vs FLAIR">T2 vs FLAIR</SelectItem>
                </SelectContent>
              </Select>
            )}

            {comparisonMode === 'cases' && (
              <Select value={comparisonCase} onValueChange={setComparisonCase}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select comparison case" />
                </SelectTrigger>
                <SelectContent>
                  {caseOptions.filter(c => c.name !== selectedCase).map((caseOption) => (
                    <SelectItem key={caseOption.name} value={caseOption.name}>
                      {caseOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={() => handleComparisonModeChange('sequences')}
              variant={comparisonMode === 'sequences' ? 'default' : 'outline'}
              size="sm"
              className={comparisonMode === 'sequences' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Compare Sequences
            </Button>

            <Button
              onClick={() => handleComparisonModeChange('cases')}
              variant={comparisonMode === 'cases' ? 'default' : 'outline'}
              size="sm"
              className={comparisonMode === 'cases' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              <Copy className="h-4 w-4 mr-2" />
              Compare Cases
            </Button>

            <Button
              onClick={() => handleComparisonModeChange('single')}
              variant={comparisonMode === 'single' ? 'default' : 'outline'}
              size="sm"
              className={comparisonMode === 'single' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Single View
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Image Area */}
        <div className={`${comparisonMode === 'single' ? 'flex-1' : 'w-2/3'} flex`}>
          {/* Primary Image */}
          <div className={`${comparisonMode === 'single' ? 'w-full' : 'w-1/2'} bg-black/30 backdrop-blur-xl border-r border-gray-800 flex flex-col`}>
            {/* Image Controls */}
            <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={currentModality} onValueChange={setCurrentModality}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {caseImageData && Object.keys(caseImageData.modalities).map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {caseImageData && currentModality && (
                    <Select value={currentView} onValueChange={setCurrentView}>
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(caseImageData.modalities[currentModality] || {}).map((view) => (
                          <SelectItem key={view} value={view}>
                            {view}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {comparisonMode !== 'single' && (
                  <span className="text-sm text-gray-400">Primary Image</span>
                )}
              </div>
            </div>

            {/* Image Display */}
            <div className="flex-1 flex items-center justify-center p-6">
              {getCurrentImagePath() ? (
                <motion.img
                  key={getCurrentImagePath()}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={getCurrentImagePath()}
                  alt={`${currentModality} - ${currentView}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-lg mb-2">No image available</div>
                  <div className="text-sm">Please select a different view</div>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Image (for comparisons) */}
          {comparisonMode !== 'single' && (
            <div className="w-1/2 bg-black/30 backdrop-blur-xl flex flex-col">
              {/* Image Controls */}
              <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {comparisonMode === 'sequences' ? (
                      <>
                        <Select value={currentModality2} onValueChange={setCurrentModality2}>
                          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {caseImageData && Object.keys(caseImageData.modalities).map((modality) => (
                              <SelectItem key={modality} value={modality}>
                                {modality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {caseImageData && currentModality2 && (
                          <Select value={currentView2} onValueChange={setCurrentView2}>
                            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(caseImageData.modalities[currentModality2] || {}).map((view) => (
                                <SelectItem key={view} value={view}>
                                  {view}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    ) : (
                      <>
                        <Select value={currentModality} onValueChange={setCurrentModality}>
                          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {comparisonImageData && Object.keys(comparisonImageData.modalities).map((modality) => (
                              <SelectItem key={modality} value={modality}>
                                {modality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {comparisonImageData && currentModality && (
                          <Select value={currentView} onValueChange={setCurrentView}>
                            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(comparisonImageData.modalities[currentModality] || {}).map((view) => (
                                <SelectItem key={view} value={view}>
                                  {view}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {comparisonMode === 'sequences' ? 'Comparison Sequence' : 'Comparison Case'}
                  </span>
                </div>
              </div>

              {/* Image Display */}
              <div className="flex-1 flex items-center justify-center p-6">
                {getCurrentImagePath(true) ? (
                  <motion.img
                    key={getCurrentImagePath(true)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={getCurrentImagePath(true)}
                    alt={`${comparisonMode === 'sequences' ? currentModality2 : currentModality} - ${comparisonMode === 'sequences' ? currentView2 : currentView}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    <div className="text-lg mb-2">No image available</div>
                    <div className="text-sm">Please select a different view</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Learning Panel */}
        <div className={`${comparisonMode === 'single' ? 'w-96' : 'w-1/3'} bg-gray-900/50 backdrop-blur-xl border-l border-gray-800 flex flex-col`}>
          {/* Panel Header */}
          <div className="bg-gray-900/80 border-b border-gray-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              {getLearningModeLabel(learningMode)}
            </h2>
            {patientContext && (
              <div className="mt-3 space-y-2 text-sm">
                <div className="text-gray-300">
                  <span className="text-blue-400">Patient:</span> {patientContext.patient}
                </div>
                <div className="text-gray-300">
                  <span className="text-green-400">Presentation:</span> {patientContext.presentation}
                </div>
              </div>
            )}
          </div>

          {/* Learning Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {learningContent && currentLevelContent && (
              <motion.div
                key={learningLevel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Primary Concept */}
                <div>
                  <h3 className="text-white font-medium mb-3">
                    {learningContent.primaryConcept}
                  </h3>
                  <div className={`${currentLevelContent.bgColor} rounded-lg p-4`}>
                    <p className={`${currentLevelContent.textColor} text-sm font-medium mb-2`}>
                      {currentLevelContent.title}:
                    </p>
                    <div className="text-white/80 text-sm leading-relaxed">
                      {formatText(currentLevelContent.content)}
                    </div>
                  </div>
                </div>

                {/* Current Learning Level Indicator */}
                <div className="flex items-center justify-center pt-4">
                  <div className="flex items-center gap-2">
                    {(['discovery', 'focused', 'clinical', 'comprehensive'] as const).map((level, index) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          learningLevel === level ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
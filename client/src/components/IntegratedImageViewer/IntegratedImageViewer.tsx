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
  const [comparisonModality, setComparisonModality] = useState<string>('');
  const [comparisonView, setComparisonView] = useState<string>('');
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

  // Debug logging
  console.log("Image data structure:", imageData);
  console.log("Selected case:", selectedCase, "Case key:", caseKey);
  console.log("Case image data:", caseImageData);
  console.log("Comparison case:", comparisonCase, "Comparison image data:", comparisonImageData);

  // Initialize modality and view when viewer opens
  useEffect(() => {
    if (caseImageData) {
      setCurrentModality(caseImageData.defaultModality);
      setCurrentView(caseImageData.defaultView);
      
      // Set up default comparison sequence dynamically
      if (comparisonMode === 'sequences') {
        const modalities = Object.keys(caseImageData.modalities);
        
        if (modalities.length >= 2) {
          // Use first two available modalities
          const mod1 = modalities[0];
          const mod2 = modalities[1];
          
          setCurrentModality(mod1);
          setCurrentModality2(mod2);
          setSequenceComparison(`${mod1} vs ${mod2}`);
          
          // Set default views for each modality
          const mod1Views = Object.keys(caseImageData.modalities[mod1] || {});
          const mod2Views = Object.keys(caseImageData.modalities[mod2] || {});
          
          if (mod1Views.length > 0) setCurrentView(mod1Views[0]);
          if (mod2Views.length > 0) setCurrentView2(mod2Views[0]);
          
          console.log("Initialized sequence comparison:", `${mod1} vs ${mod2}`);
        }
      }
    }
  }, [caseImageData, comparisonMode]);

  // Initialize comparison case modality and view when comparison case changes
  useEffect(() => {
    if (comparisonImageData) {
      setComparisonModality(comparisonImageData.defaultModality);
      setComparisonView(comparisonImageData.defaultView);
    }
  }, [comparisonImageData]);

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

  // Generate available sequence combinations dynamically
  const getAvailableSequenceComparisons = () => {
    if (!caseImageData) return [];
    
    const modalities = Object.keys(caseImageData.modalities);
    const combinations = [];
    
    // Generate all possible combinations of modalities
    for (let i = 0; i < modalities.length; i++) {
      for (let j = i + 1; j < modalities.length; j++) {
        combinations.push(`${modalities[i]} vs ${modalities[j]}`);
      }
    }
    
    return combinations;
  };

  // Handle sequence comparison change
  const handleSequenceComparisonChange = (comparison: string) => {
    setSequenceComparison(comparison);
    if (caseImageData) {
      const [mod1, mod2] = comparison.split(' vs ');
      const modalities = Object.keys(caseImageData.modalities);
      
      console.log("Changing sequence comparison to:", comparison);
      console.log("Available modalities:", modalities);
      
      if (modalities.includes(mod1) && modalities.includes(mod2)) {
        setCurrentModality(mod1);
        setCurrentModality2(mod2);
        
        // Set default views for each modality
        const mod1Views = Object.keys(caseImageData.modalities[mod1] || {});
        const mod2Views = Object.keys(caseImageData.modalities[mod2] || {});
        
        if (mod1Views.length > 0) setCurrentView(mod1Views[0]);
        if (mod2Views.length > 0) setCurrentView2(mod2Views[0]);
        
        console.log("Set modalities:", mod1, "vs", mod2);
        console.log("Set views:", mod1Views[0], "vs", mod2Views[0]);
      }
    }
  };

  // Get current image path
  const getCurrentImagePath = (isSecondImage = false) => {
    let modality, view, imageDataToUse;
    
    console.log("=== DEBUG getCurrentImagePath ===");
    console.log("isSecondImage:", isSecondImage);
    console.log("comparisonMode:", comparisonMode);
    console.log("States:", {
      currentModality,
      currentView,
      currentModality2,
      currentView2,
      comparisonCase,
      comparisonModality,
      comparisonView
    });
    
    if (isSecondImage && comparisonMode === 'cases') {
      // For case comparison, use comparison case data
      imageDataToUse = comparisonImageData;
      
      console.log("Case comparison mode - comparison data:", comparisonImageData);
      
      // Use separate state variables for comparison case
      if (comparisonImageData) {
        const availableModalities = Object.keys(comparisonImageData.modalities);
        console.log("Available modalities in comparison case:", availableModalities);
        
        // Use dedicated comparison state variables
        modality = comparisonModality || comparisonImageData.defaultModality;
        view = comparisonView || comparisonImageData.defaultView;
        
        console.log("Using comparison case modality/view:", modality, view);
      } else {
        modality = currentModality;
        view = currentView;
      }
    } else if (isSecondImage && comparisonMode === 'sequences') {
      // For sequence comparison, use same case data but different modality
      modality = currentModality2;
      view = currentView2;
      imageDataToUse = caseImageData;
      console.log("Sequence comparison mode - using modality2/view2:", modality, view);
    } else {
      // Primary image
      modality = currentModality;
      view = currentView;
      imageDataToUse = caseImageData;
      console.log("Primary image mode:", modality, view);
    }

    console.log("Final resolved values:", {
      modality,
      view,
      imageDataAvailable: !!imageDataToUse
    });

    if (!modality || !view || !imageDataToUse) {
      console.log("❌ Missing data for image path:", { modality, view, imageDataToUse: !!imageDataToUse });
      return '';
    }
    
    const modalityData = imageDataToUse.modalities[modality];
    if (!modalityData) {
      console.log("❌ No modality data found for:", modality, "Available modalities:", Object.keys(imageDataToUse.modalities));
      return '';
    }
    
    const imagePath = modalityData[view] || '';
    console.log("✅ Final image path:", imagePath);
    console.log("=== END DEBUG ===");
    return imagePath;
  };

  // Get learning content based on mode and level
  const getLearningContent = (useComparisonCase = false) => {
    const caseToUse = useComparisonCase && comparisonMode === 'cases' && comparisonCaseData 
      ? comparisonCaseData 
      : currentCaseData;
      
    if (!caseToUse?.case?.framework) return null;

    const framework = caseToUse.case.framework;
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

  // Enhanced text formatting with improved readability and color coding
  const formatText = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        const bulletContent = line.substring(1).trim();
        const formattedContent = enhanceTextFormatting(bulletContent);
        
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span className="text-orange-400 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        );
      }
      
      // Handle regular paragraphs with enhanced formatting
      const formattedContent = enhanceTextFormatting(line);
      return (
        <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: formattedContent }} />
      );
    });
  };

  // Enhanced text formatting function with color coding
  const enhanceTextFormatting = (text: string) => {
    return text
      // Handle specific case for "**'blooming' effect**" first
      .replace(/\*\*'blooming' effect\*\*/g, "the <span class=\"text-orange-400 font-semibold\">'blooming'</span> effect")
      
      // Handle bold text with ** markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      
      // Handle navigation hints (text starting with → followed by *text*)
      .replace(/→\s*\*([^*]+)\*/g, '→ <span class="text-gray-400 italic">$1</span>')
      
      // Handle key medical/technical terms in parentheses with *text*
      .replace(/\*([^*]+)\*/g, (match, content) => {
        // Determine color based on content type
        if (content.includes('vs') || content.includes('diamagnetic') || content.includes('paramagnetic') || 
            content.includes('magnetic') || content.includes('susceptibility') || content.includes('field')) {
          // Physics/technical terms - orange
          return `<span class="text-orange-400 font-medium">${content}</span>`;
        } else if (content.includes('mass effect') || content.includes('blooming') || content.includes('echo') ||
                   content.includes('signal') || content.includes('contrast') || content.includes('sequence')) {
          // Imaging terminology - orange
          return `<span class="text-orange-400 font-semibold">'${content}'</span>`;
        } else if (content.includes('days') || content.includes('weeks') || content.includes('minutes') ||
                   content.includes('hours') || content.includes('CO₂') || content.includes('N₂')) {
          // Medical timeline/chemistry terms - cyan
          return `<span class="text-cyan-400 font-medium">${content}</span>`;
        } else if (content.includes('View') || content.includes('see') || content.includes('understand')) {
          // Navigation hints - gray
          return `<span class="text-gray-400 italic">${content}</span>`;
        } else {
          // Default medical terms - cyan
          return `<span class="text-cyan-400 font-medium">${content}</span>`;
        }
      })
      
      // Handle quoted terms that should be emphasized (but avoid double-processing)
      .replace(/'([^']+)'/g, (match, content) => {
        // Skip if already processed
        if (match.includes('span class=')) return match;
        return `<span class="text-orange-400 font-semibold">'${content}'</span>`;
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
  const getPatientContext = (useComparisonCase = false) => {
    const caseToUse = useComparisonCase && comparisonMode === 'cases' && comparisonCaseData 
      ? comparisonCaseData 
      : currentCaseData;
      
    if (caseToUse?.case?.caseName === 'Gas Bubbles on SWI') {
      return {
        patient: '65-year-old male',
        presentation: 'Immediately post-posterior fossa surgery',
        finding: 'Expected gas bubbles'
      };
    } else if (caseToUse?.case?.caseName === 'Trauma Gas') {
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
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Learning Levels - Hint only with hover reveal */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-5 h-20 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700 rounded-r-lg flex items-center justify-center z-50 shadow-lg group">
        <span className="text-orange-400 text-xs font-medium transform -rotate-90 whitespace-nowrap">LEVELS</span>
        
        {/* Full tab - hidden by default, shows on group hover */}
        <div className="absolute left-5 top-0 opacity-0 translate-x-[-20px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-r-lg shadow-2xl p-4 min-w-[200px]">
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
        </div>
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
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSequenceComparisons().map((comparison) => (
                    <SelectItem key={comparison} value={comparison}>
                      {comparison}
                    </SelectItem>
                  ))}
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
        <div className={`${comparisonMode === 'single' ? 'flex-1' : 'w-2/3'} flex overflow-hidden`}>
          {/* Primary Image */}
          <div className={`${comparisonMode === 'single' ? 'w-full' : 'w-1/2'} bg-black/30 backdrop-blur-xl border-r border-gray-800 flex flex-col overflow-hidden`}>
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
                    ) : comparisonMode === 'cases' && comparisonImageData ? (
                      <>
                        <Select 
                          value={comparisonModality || comparisonImageData.defaultModality} 
                          onValueChange={(value) => {
                            setComparisonModality(value);
                            // Reset view to default for the new modality
                            const modalityData = comparisonImageData.modalities[value];
                            if (modalityData) {
                              const firstView = Object.keys(modalityData)[0];
                              setComparisonView(firstView);
                            }
                          }}
                        >
                          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(comparisonImageData.modalities).map((modality) => (
                              <SelectItem key={modality} value={modality}>
                                {modality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {comparisonImageData && comparisonModality && (
                          <Select 
                            value={comparisonView || comparisonImageData.defaultView} 
                            onValueChange={setComparisonView}
                          >
                            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(comparisonImageData.modalities[comparisonModality] || {}).map((view) => (
                                <SelectItem key={view} value={view}>
                                  {view}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    ) : null}
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
                    alt={comparisonMode === 'sequences' 
                      ? `${currentModality2} - ${currentView2}` 
                      : `${comparisonCase} - ${comparisonImageData?.defaultModality} - ${comparisonImageData?.defaultView}`
                    }
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
        <div className={`${comparisonMode === 'single' ? 'w-96' : 'w-1/3'} bg-gray-900/50 backdrop-blur-xl border-l border-gray-800 flex flex-col h-full overflow-hidden`}>
          {comparisonMode === 'cases' ? (
            // Split view for case comparison
            <div className="flex flex-col h-full">
              {/* Primary Case */}
              <div className="flex-1 border-b border-gray-700 flex flex-col overflow-hidden">
                <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-3 flex-shrink-0">
                  <h3 className="text-sm font-semibold text-white">
                    {currentCaseData?.case?.caseName} - {getLearningModeLabel(learningMode)}
                  </h3>
                  {patientContext && (
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="text-gray-300">
                        <span className="text-blue-400">Patient:</span> {patientContext.patient}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-green-400">Presentation:</span> {patientContext.presentation}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                  {learningContent && currentLevelContent && (
                    <motion.div
                      key={`primary-${learningLevel}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-white font-medium mb-2 text-sm">
                        {learningContent.primaryConcept}
                      </h4>
                      <div className={`${currentLevelContent.bgColor} rounded-lg p-3`}>
                        <p className={`${currentLevelContent.textColor} text-xs font-medium mb-1`}>
                          {currentLevelContent.title}:
                        </p>
                        <div className="text-white/80 text-xs leading-relaxed">
                          {formatText(currentLevelContent.content)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Comparison Case */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-3 flex-shrink-0">
                  <h3 className="text-sm font-semibold text-white">
                    {comparisonCaseData?.case?.caseName} - {getLearningModeLabel(learningMode)}
                  </h3>
                  {getPatientContext(true) && (
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="text-gray-300">
                        <span className="text-blue-400">Patient:</span> {getPatientContext(true)?.patient}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-green-400">Presentation:</span> {getPatientContext(true)?.presentation}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                  {(() => {
                    const comparisonContent = getLearningContent(true);
                    const comparisonLevelContent = comparisonContent ? {
                      discovery: {
                        title: 'Discovery Insight',
                        content: comparisonContent.discoveryInsight,
                        bgColor: 'bg-blue-950/30',
                        textColor: 'text-blue-200'
                      },
                      focused: {
                        title: 'Focused Learning',
                        content: comparisonContent.focusedLearning,
                        bgColor: 'bg-green-950/30',
                        textColor: 'text-green-200'
                      },
                      clinical: {
                        title: 'Clinical Application',
                        content: comparisonContent.clinicalApplication,
                        bgColor: 'bg-orange-950/30',
                        textColor: 'text-orange-200'
                      },
                      comprehensive: {
                        title: 'Comprehensive Analysis',
                        content: comparisonContent.comprehensiveAnalysis,
                        bgColor: 'bg-purple-950/30',
                        textColor: 'text-purple-200'
                      }
                    }[learningLevel] : null;

                    return comparisonContent && comparisonLevelContent ? (
                      <motion.div
                        key={`comparison-${learningLevel}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-white font-medium mb-2 text-sm">
                          {comparisonContent.primaryConcept}
                        </h4>
                        <div className={`${comparisonLevelContent.bgColor} rounded-lg p-3`}>
                          <p className={`${comparisonLevelContent.textColor} text-xs font-medium mb-1`}>
                            {comparisonLevelContent.title}:
                          </p>
                          <div className="text-white/80 text-xs leading-relaxed">
                            {formatText(comparisonLevelContent.content)}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-gray-500 text-xs">No content available for comparison case</div>
                    );
                  })()}
                </div>
              </div>

              {/* Learning Level Indicator */}
              <div className="flex items-center justify-center py-2 bg-gray-900/50">
                <div className="flex items-center gap-1">
                  {(['discovery', 'focused', 'clinical', 'comprehensive'] as const).map((level) => (
                    <div
                      key={level}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        learningLevel === level ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Single case view
            <>
              <div className="bg-gray-900/80 border-b border-gray-700 px-6 py-4 flex-shrink-0">
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

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                {learningContent && currentLevelContent && (
                  <motion.div
                    key={learningLevel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
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

                    <div className="flex items-center justify-center pt-4">
                      <div className="flex items-center gap-2">
                        {(['discovery', 'focused', 'clinical', 'comprehensive'] as const).map((level) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
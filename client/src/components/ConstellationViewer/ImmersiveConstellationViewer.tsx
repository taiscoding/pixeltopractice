import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, ArrowLeft, Brain, Settings, Stethoscope, Search, Plus, Minus, Maximize, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import CustomNode from './CustomNode';
import { availableCases } from '@/data/curated-cases';
import MedicalImageViewer from '../MedicalImageViewer/MedicalImageViewer';

// Helper function to format text with markdown-like syntax
const formatText = (text: string) => {
  return text.split('\n').map((line, lineIndex) => {
    // Handle bullet points
    if (line.trim().startsWith('•')) {
      const content = line.trim().substring(1).trim();
      return (
        <div key={lineIndex} className="flex items-start gap-2 mb-1">
          <span className="text-white/60 mt-1">•</span>
          <span dangerouslySetInnerHTML={{ __html: formatInlineText(content) }} />
        </div>
      );
    }

    // Handle navigation arrows
    if (line.trim().startsWith('→')) {
      const content = line.trim().substring(1).trim();
      return (
        <div key={lineIndex} className="mt-3 pt-3 border-t border-white/10">
          <span className="text-blue-400 text-sm italic" dangerouslySetInnerHTML={{ __html: formatInlineText(content) }} />
        </div>
      );
    }

    // Regular paragraphs
    if (line.trim()) {
      return (
        <p key={lineIndex} className="mb-2" dangerouslySetInnerHTML={{ __html: formatInlineText(line) }} />
      );
    }

    // Empty lines
    return <div key={lineIndex} className="mb-2" />;
  });
};

// Helper function to format inline text (bold, italic, etc.)
const formatInlineText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')
    .replace(/CO₂/g, '<span class="font-medium text-blue-300">CO₂</span>')
    .replace(/N₂/g, '<span class="font-medium text-blue-300">N₂</span>')
    .replace(/T2\*/g, '<span class="font-medium text-purple-300">T2*</span>')
    .replace(/SWI/g, '<span class="font-medium text-green-300">SWI</span>')
    .replace(/CSF/g, '<span class="font-medium text-amber-300">CSF</span>');
};

interface ImmersiveConstellationViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCase: string;
  onCaseSelect?: (caseId: string) => void;
}

// Inner component that has access to ReactFlow instance
function ConstellationFlow({ 
  selectedNode,
  setSelectedNode,
  knowledgeDepth,
  setKnowledgeDepth,
  explorationMode,
  setExplorationMode,
  explorationProgress,
  setExplorationProgress,
  isDarkMode,
  setIsDarkMode,
  showTopUI,
  setShowTopUI,
  showLeftUI,
  setShowLeftUI,
  showBottomUI,
  setShowBottomUI,
  onClose,
  nodeTypes,
  initialNodes,
  initialEdges,
  getRecommendedNode,
  getKnowledgeDepthLabel,
  handleNodeClick,
  caseInfo,
  selectedCase,
  onCaseSelect
}: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Update nodes when initialNodes change (case switching)
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update edges when initialEdges change (case switching)
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          selected: node.id === selectedNode,
          style: {
            ...node.style,
            filter: node.id === getRecommendedNode() && explorationMode === 'guided' 
              ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))' 
              : undefined
          }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="w-full h-full"
        attributionPosition="bottom-left"
      >
        <Background 
          color="rgba(148, 163, 184, 0.1)" 
          gap={64} 
          size={2}
        />

        {/* Enhanced Custom Controls */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomIn}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl transition-all duration-200 hover:scale-105"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleFullscreen}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl transition-all duration-200 hover:scale-105"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl transition-all duration-200 hover:scale-105"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </ReactFlow>

      {/* Enhanced Top Hover Area - Exit + Exploration Progress */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-40"
        onMouseEnter={() => setShowTopUI(true)}
        onMouseLeave={() => setShowTopUI(false)}
      >
        {/* The actual UI panel content goes here and has higher z-index */}
      </div>

      {/* Enhanced Left Hover Area - Learning Settings */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-40"
        onMouseEnter={() => setShowLeftUI(true)}
        onMouseLeave={() => setShowLeftUI(false)}
      >
      </div>

      {/* Enhanced Bottom Hover Area - Case Selection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-40"
        onMouseEnter={() => setShowBottomUI(true)}
        onMouseLeave={() => setShowBottomUI(false)}
      >
      </div>

      {/* Top UI Bar */}
        <AnimatePresence>
          {showTopUI && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 shadow-2xl z-50"
            >
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit Immersive Mode
                </Button>

                <div className="h-6 w-px bg-white/20" />

                <div className="flex items-center gap-4">
                  <div className="text-white/70 text-sm">
                    Exploration Progress
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={explorationProgress} 
                      className="w-32 h-2 bg-white/20"
                    />
                    <span className="text-white text-sm font-medium min-w-[3rem]">
                      {explorationProgress}%
                    </span>
                  </div>
                  {explorationMode === 'guided' && getRecommendedNode() && (
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      {getRecommendedNode() === 'technical' && <Settings className="h-4 w-4" />}
                      {getRecommendedNode() === 'clinical' && <Stethoscope className="h-4 w-4" />}
                      {getRecommendedNode() === 'anatomical' && <Search className="h-4 w-4" />}
                      {getRecommendedNode() === 'central' && <Brain className="h-4 w-4" />}
                      Next: {getRecommendedNode()}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Side Panel */}
        <AnimatePresence>
          {showLeftUI && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl min-w-[300px] z-50"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-4">Knowledge Depth</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      {[0, 1, 2].map((level) => (
                        <Button
                          key={level}
                          variant={knowledgeDepth[0] === level ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setKnowledgeDepth([level])}
                          className={`justify-start text-left transition-all duration-200 ${
                            knowledgeDepth[0] === level 
                              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {getKnowledgeDepthLabel(level)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/20" />
                <div>
                  <h3 className="text-white font-medium mb-3">Learning Mode</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={explorationMode === 'free' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setExplorationMode('free')}
                      className={`transition-all duration-200 ${explorationMode === 'free' 
                        ? 'bg-orange-600 hover:bg-orange-700 shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Free
                    </Button>
                    <Button
                      variant={explorationMode === 'guided' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setExplorationMode('guided')}
                      className={`transition-all duration-200 ${explorationMode === 'guided' 
                        ? 'bg-orange-600 hover:bg-orange-700 shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Guided
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom UI Panel */}
        <AnimatePresence>
          {showBottomUI && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 shadow-2xl z-50"
            >
              <div className="flex items-center gap-6">
                <div className="text-white/70 text-sm">
                  Case Selection
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant={selectedCase === 'gas-bubbles-swi' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (onCaseSelect && selectedCase !== 'gas-bubbles-swi') {
                        onCaseSelect('gas-bubbles-swi');
                      }
                    }}
                    className={`transition-all duration-200 hover:scale-105 ${
                      selectedCase === 'gas-bubbles-swi' 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                    }`}
                  >
                    Gas Bubbles SWI
                  </Button>
                  <Button
                    variant={selectedCase === 'trauma-gas' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (onCaseSelect && selectedCase !== 'trauma-gas') {
                        onCaseSelect('trauma-gas');
                      }
                    }}
                    className={`transition-all duration-200 hover:scale-105 ${
                      selectedCase === 'trauma-gas' 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                    }`}
                  >
                    Trauma Gas
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Central Node Detail Panel */}
      <AnimatePresence>
        {selectedNode === 'central' && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 z-50 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 rounded-lg p-2 shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {caseInfo?.caseName} - Patient Context
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {caseInfo?.caseName === 'Gas Bubbles on SWI' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-orange-300 font-medium mb-2">Patient</h3>
                    <p className="text-white text-lg font-semibold">65-year-old male</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-blue-300 font-medium mb-2">Presentation</h3>
                    <p className="text-white/80 text-sm">Post-operative examination immediately following excision of posterior fossa mass</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-amber-300 font-medium mb-2">Key Finding</h3>
                    <p className="text-white/80 text-sm">Multiple low signal intensity rounded filling defects in subarachnoid space and lateral ventricles</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-green-300 font-medium mb-2">Clinical Significance</h3>
                    <p className="text-white text-sm"><span className="font-semibold text-green-400">EXPECTED</span> finding, routine follow-up</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-orange-300 font-medium mb-2">Patient</h3>
                    <p className="text-white text-lg font-semibold">20-year-old male</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-blue-300 font-medium mb-2">Presentation</h3>
                    <p className="text-white/80 text-sm">Fall from bike</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-amber-300 font-medium mb-2">Key Finding</h3>
                    <p className="text-white/80 text-sm">Single locule of gas within left transverse sinus + hyperdensity of left sigmoid sinus</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-orange-400 font-medium mb-2">Clinical Significance</h3>
                    <p className="text-white text-sm"><span className="font-semibold text-orange-400">EMERGENCY</span> - skull fracture crossing suture = major thrombosis risk factor</p>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-gray-900/30 rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-medium mb-3">Clinical Context</h3>
                {caseInfo?.caseName === 'Trauma Gas' && (
                  <p className="text-white/70 text-sm mb-4">
                    Subtle diastasis of left lambdoid suture, small volume fluid in left mastoid air cells
                  </p>
                )}
                <div className="mb-4">
                  <h4 className="text-white font-medium text-sm mb-2">Explore the Frameworks</h4>
                  <p className="text-white/70 text-sm mb-4">
                    Click on the Technical, Clinical, or Anatomical nodes to understand different aspects of this case.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => setSelectedNode('technical')}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    size="sm"
                  >
                    <Settings className="h-4 w-4" />
                    Technical Framework
                  </Button>
                  <Button
                    onClick={() => setSelectedNode('clinical')}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    size="sm"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Clinical Framework
                  </Button>
                  <Button
                    onClick={() => setSelectedNode('anatomical')}
                    className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
                    size="sm"
                  >
                    <Search className="h-4 w-4" />
                    Anatomical Framework
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Selected Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && selectedNode !== 'central' && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute right-0 top-0 bottom-0 w-96 bg-black/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto z-50 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedNode === 'technical' && (
                    <div className="bg-blue-600 rounded-lg p-2 shadow-lg">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {selectedNode === 'clinical' && (
                    <div className="bg-green-600 rounded-lg p-2 shadow-lg">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {selectedNode === 'anatomical' && (
                    <div className="bg-amber-600 rounded-lg p-2 shadow-lg">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-white capitalize">
                    {selectedNode} Framework
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {selectedNode === 'technical' && caseInfo && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {caseInfo.framework.TECHNICAL.primaryConcept}
                      </h3>
                      <div className="bg-gray-900/50 rounded-lg p-3 mb-3 border border-white/10">
                        <p className="text-orange-300 text-sm font-medium mb-1">Discovery Insight:</p>
                        <p className="text-white/80 text-sm">
                          {caseInfo.framework.TECHNICAL.discoveryInsight}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        {getKnowledgeDepthLabel(knowledgeDepth[0])}
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {knowledgeDepth[0] === 0 && formatText(caseInfo.framework.TECHNICAL.focusedLearning)}
                        {knowledgeDepth[0] === 1 && formatText(caseInfo.framework.TECHNICAL.clinicalApplication)}
                        {knowledgeDepth[0] === 2 && formatText(caseInfo.framework.TECHNICAL.comprehensiveAnalysis)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode === 'clinical' && caseInfo && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {caseInfo.framework.CLINICAL.primaryConcept}
                      </h3>
                      <div className="bg-gray-900/50 rounded-lg p-3 mb-3 border border-white/10">
                        <p className="text-green-300 text-sm font-medium mb-1">Discovery Insight:</p>
                        <p className="text-white/80 text-sm">
                          {caseInfo.framework.CLINICAL.discoveryInsight}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        {getKnowledgeDepthLabel(knowledgeDepth[0])}
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {knowledgeDepth[0] === 0 && formatText(caseInfo.framework.CLINICAL.focusedLearning)}
                        {knowledgeDepth[0] === 1 && formatText(caseInfo.framework.CLINICAL.clinicalApplication)}
                        {knowledgeDepth[0] === 2 && formatText(caseInfo.framework.CLINICAL.comprehensiveAnalysis)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode === 'anatomical' && caseInfo && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {caseInfo.framework.ANATOMICAL.primaryConcept}
                      </h3>
                      <div className="bg-gray-900/50 rounded-lg p-3 mb-3 border border-white/10">
                        <p className="text-amber-300 text-sm font-medium mb-1">Discovery Insight:</p>
                        <p className="text-white/80 text-sm">
                          {caseInfo.framework.ANATOMICAL.discoveryInsight}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        {getKnowledgeDepthLabel(knowledgeDepth[0])}
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {knowledgeDepth[0] === 0 && formatText(caseInfo.framework.ANATOMICAL.focusedLearning)}
                        {knowledgeDepth[0] === 1 && formatText(caseInfo.framework.ANATOMICAL.clinicalApplication)}
                        {knowledgeDepth[0] === 2 && formatText(caseInfo.framework.ANATOMICAL.comprehensiveAnalysis)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ImmersiveConstellationViewer({ 
  isOpen, 
  onClose, 
  selectedCase,
  onCaseSelect 
}: ImmersiveConstellationViewerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [knowledgeDepth, setKnowledgeDepth] = useState([1]); // 0=Focused, 1=Clinical, 2=Comprehensive
  const [explorationMode, setExplorationMode] = useState<'free' | 'guided'>('free');
  const [explorationProgress, setExplorationProgress] = useState(33);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTopUI, setShowTopUI] = useState(false);
  const [showLeftUI, setShowLeftUI] = useState(false);
  const [showBottomUI, setShowBottomUI] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Get current case data
  const currentCaseData = availableCases[selectedCase];
  const caseInfo = currentCaseData?.case;
  const nodePositions = currentCaseData?.nodePositions;
  const nodeColors = currentCaseData?.nodeColors;



  // Helper functions for labels and subtext
  const getCentralLabel = (caseName: string) => {
    switch (caseName) {
      case 'Gas Bubbles on SWI':
        return 'Gas Bubbles\nSWI';
      case 'Trauma Gas':
        return 'Trauma Gas\nEmergency';
      default:
        return 'Case\nStudy';
    }
  };

  const getSubtext = (nodeType: string, caseName: string) => {
    if (caseName === 'Gas Bubbles on SWI') {
      switch (nodeType) {
        case 'technical':
          return 'T2* effects, blooming artifacts';
        case 'clinical':
          return '<1 week normal post-op';
        case 'anatomical':
          return 'Surgical site vs remote location';
        default:
          return '';
      }
    } else if (caseName === 'Trauma Gas') {
      switch (nodeType) {
        case 'technical':
          return 'CT shows intrasinus gas + thrombosis';
        case 'clinical':
          return 'Skull fracture = emergency thrombosis risk';
        case 'anatomical':
          return 'Lambdoid fracture → venous pathway damage';
        default:
          return '';
      }
    }
    return '';
  };

  const getTechnicalLabel = (caseName: string) => {
    switch (caseName) {
      case 'Gas Bubbles on SWI':
        return 'TECHNICAL\nSusceptibility-Weighted Imaging';
      case 'Trauma Gas':
        return 'TECHNICAL\nIntrasinus Gas Detection';
      default:
        return 'TECHNICAL\nImaging Method';
    }
  };

  const getClinicalLabel = (caseName: string) => {
    switch (caseName) {
      case 'Gas Bubbles on SWI':
        return 'CLINICAL\nTimeline-Dependent Significance';
      case 'Trauma Gas':
        return 'CLINICAL\nEmergency Risk Stratification';
      default:
        return 'CLINICAL\nPatient Impact';
    }
  };

  const getAnatomicalLabel = (caseName: string) => {
    switch (caseName) {
      case 'Gas Bubbles on SWI':
        return 'ANATOMICAL\nLocation Suggests Etiology';
      case 'Trauma Gas':
        return 'ANATOMICAL\nVenous Thrombosis Pathway';
      default:
        return 'ANATOMICAL\nStructural Context';
    }
  };

  const initialNodes: Node[] = useMemo(() => {
    if (!currentCaseData || !caseInfo || !nodePositions || !nodeColors) return [];

    return [
      {
        id: 'central',
        type: 'custom',
        position: nodePositions.central,
        data: { 
          label: getCentralLabel(caseInfo.caseName),
          type: 'central',
          icon: 'brain',
          color: nodeColors.central
        },
      },
      {
        id: 'technical',
        type: 'custom',
        position: nodePositions.technical,
        data: { 
          label: getTechnicalLabel(caseInfo.caseName),
          type: 'technical',
          icon: 'settings',
          color: nodeColors.technical,
          framework: caseInfo.framework.TECHNICAL,
          caseName: caseInfo.caseName,
          subtext: getSubtext('technical', caseInfo.caseName)
        },
      },
      {
        id: 'clinical',
        type: 'custom',
        position: nodePositions.clinical,
        data: { 
          label: getClinicalLabel(caseInfo.caseName),
          type: 'clinical',
          icon: 'stethoscope',
          color: nodeColors.clinical,
          framework: caseInfo.framework.CLINICAL,
          caseName: caseInfo.caseName,
          subtext: getSubtext('clinical', caseInfo.caseName)
        },
      },
      {
        id: 'anatomical',
        type: 'custom',
        position: nodePositions.anatomical,
        data: { 
          label: getAnatomicalLabel(caseInfo.caseName),
          type: 'anatomical',
          icon: 'search',
          color: nodeColors.anatomical,
          framework: caseInfo.framework.ANATOMICAL,
          caseName: caseInfo.caseName,
          subtext: getSubtext('anatomical', caseInfo.caseName)
        },
      },
    ];
  }, [currentCaseData, selectedCase, caseInfo, nodePositions, nodeColors]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!currentCaseData) return [];

    return [
      {
        id: 'central-technical',
        source: 'central',
        sourceHandle: 'top',
        target: 'technical',
        targetHandle: 'target',
        type: 'smoothstep',
        style: { stroke: nodeColors.technical, strokeWidth: 4, strokeDasharray: '12,6' },
        animated: true,
      },
      {
        id: 'central-clinical',
        source: 'central',
        sourceHandle: 'right',
        target: 'clinical',
        targetHandle: 'target',
        type: 'smoothstep',
        style: { stroke: nodeColors.clinical, strokeWidth: 4, strokeDasharray: '12,6' },
        animated: true,
      },
      {
        id: 'central-anatomical',
        source: 'central',
        sourceHandle: 'left',
        target: 'anatomical',
        targetHandle: 'target',
        type: 'smoothstep',
        style: { stroke: nodeColors.anatomical, strokeWidth: 4, strokeDasharray: '12,6' },
        animated: true,
      },
    ];
  }, [currentCaseData]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.id === 'central') {
      setIsImageViewerOpen(true);
    } else {
      setSelectedNode(node.id === selectedNode ? null : node.id);
      if (node.id !== selectedNode) {
        setExplorationProgress(prev => Math.min(prev + 20, 100));
      }
    }
  }, [selectedNode]);

  const getRecommendedNode = () => {
    if (explorationMode === 'guided') {
      if (!selectedNode) return 'technical';
      if (selectedNode === 'technical') return 'clinical';
      if (selectedNode === 'clinical') return 'anatomical';
      return 'central';
    }
    return null;
  };

  const getKnowledgeDepthLabel = (value: number) => {
    switch (value) {
      case 0: return 'Focused Learning';
      case 1: return 'Clinical Application';
      case 2: return 'Comprehensive Analysis';
      default: return 'Clinical Application';
    }
  };

  if (!isOpen) return null;

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black">
        <ConstellationFlow
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          knowledgeDepth={knowledgeDepth}
          setKnowledgeDepth={setKnowledgeDepth}
          explorationMode={explorationMode}
          setExplorationMode={setExplorationMode}
          explorationProgress={explorationProgress}
          setExplorationProgress={setExplorationProgress}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          showTopUI={showTopUI}
          setShowTopUI={setShowTopUI}
          showLeftUI={showLeftUI}
          setShowLeftUI={setShowLeftUI}
          showBottomUI={showBottomUI}
          setShowBottomUI={setShowBottomUI}
          onClose={onClose}
          nodeTypes={nodeTypes}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          getRecommendedNode={getRecommendedNode}
          getKnowledgeDepthLabel={getKnowledgeDepthLabel}
          handleNodeClick={handleNodeClick}
          caseInfo={caseInfo}
          selectedCase={selectedCase}
          onCaseSelect={onCaseSelect}
        />

        {/* Medical Image Viewer */}
        <MedicalImageViewer
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          selectedCase={selectedCase}
        />
      </div>
    </ReactFlowProvider>
  );
}
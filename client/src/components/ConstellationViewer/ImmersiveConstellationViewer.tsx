import { useState, useCallback, useMemo } from 'react';
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
import { gasBubblesSWICase, nodePositions, nodeColors } from '@/data/curated-cases/gasBubblesSWI';

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
  handleNodeClick
}: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

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
        <AnimatePresence>
          {showTopUI && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20 shadow-2xl"
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
      </div>

      {/* Enhanced Left Hover Area - Learning Settings */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-40"
        onMouseEnter={() => setShowLeftUI(true)}
        onMouseLeave={() => setShowLeftUI(false)}
      >
        <AnimatePresence>
          {showLeftUI && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl min-w-[300px]"
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
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
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
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' 
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
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' 
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
      </div>

      {/* Enhanced Bottom Hover Area - Case Selection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-40"
        onMouseEnter={() => setShowBottomUI(true)}
        onMouseLeave={() => setShowBottomUI(false)}
      >
        <AnimatePresence>
          {showBottomUI && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-6">
                <div className="text-white/70 text-sm">
                  Case Selection
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      if (confirm('Compare with Trauma Gas case for differential diagnosis?')) {
                        // Future implementation for case comparison
                        alert('Trauma Gas case comparison coming soon! This will highlight key differences in patient context, timing, and imaging findings.');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Gas Bubbles SWI
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Central Node Detail Panel */}
      <AnimatePresence>
        {selectedNode === 'central' && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-6 z-50 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 rounded-lg p-2 shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Gas Bubbles on SWI - Patient Context
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-950/30 rounded-lg p-4">
                  <h3 className="text-blue-200 font-medium mb-2">Patient</h3>
                  <p className="text-white text-lg font-semibold">65-year-old male</p>
                </div>
                
                <div className="bg-green-950/30 rounded-lg p-4">
                  <h3 className="text-green-200 font-medium mb-2">Presentation</h3>
                  <p className="text-white/80 text-sm">Post-operative examination immediately following excision of posterior fossa mass</p>
                </div>
                
                <div className="bg-amber-950/30 rounded-lg p-4">
                  <h3 className="text-amber-200 font-medium mb-2">Key Finding</h3>
                  <p className="text-white/80 text-sm">Multiple low signal intensity rounded filling defects in subarachnoid space and lateral ventricles</p>
                </div>
                
                <div className="bg-purple-950/30 rounded-lg p-4">
                  <h3 className="text-purple-200 font-medium mb-2">Clinical Significance</h3>
                  <p className="text-white text-sm"><span className="font-semibold text-green-400">EXPECTED</span> finding, routine follow-up</p>
                </div>
              </div>

              <div className="mt-6 bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Explore the Frameworks</h3>
                <p className="text-white/70 text-sm mb-4">
                  Click on the Technical, Clinical, or Anatomical nodes to understand different aspects of gas bubbles on SWI.
                </p>
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
            className="absolute right-0 top-0 bottom-0 w-96 bg-black/90 backdrop-blur-xl border-l border-white/20 p-6 overflow-y-auto z-50 shadow-2xl"
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
                {selectedNode === 'technical' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {gasBubblesSWICase.framework.TECHNICAL.primaryConcept}
                      </h3>
                      <div className="bg-blue-950/30 rounded-lg p-3 mb-3">
                        <p className="text-blue-200 text-sm font-medium mb-1">Discovery Insight:</p>
                        <p className="text-white/80 text-sm">
                          {gasBubblesSWICase.framework.TECHNICAL.discoveryInsight}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        {getKnowledgeDepthLabel(knowledgeDepth[0])}
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {knowledgeDepth[0] === 0 && formatText(gasBubblesSWICase.framework.TECHNICAL.focusedLearning)}
                        {knowledgeDepth[0] === 1 && formatText(gasBubblesSWICase.framework.TECHNICAL.clinicalApplication)}
                        {knowledgeDepth[0] === 2 && formatText(gasBubblesSWICase.framework.TECHNICAL.comprehensiveAnalysis)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode === 'clinical' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {gasBubblesSWICase.framework.CLINICAL.primaryConcept}
                      </h3>
                      <div className="bg-green-950/30 rounded-lg p-3 mb-3">
                        <p className="text-green-200 text-sm font-medium mb-1">Discovery Insight:</p>
                        <p className="text-white/80 text-sm">
                          {gasBubblesSWICase.framework.CLINICAL.discoveryInsight}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        {getKnowledgeDepthLabel(knowledgeDepth[0])}
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {knowledgeDepth[0] === 0 && formatText(gasBubblesSWICase.framework.CLINICAL.focusedLearning)}
                        {knowledgeDepth[0] === 1 && formatText(gasBubblesSWICase.framework.CLINICAL.clinicalApplication)}
                        {knowledgeDepth[0] === 2 && formatText(gasBubblesSWICase.framework.CLINICAL.comprehensiveAnalysis)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode === 'anatomical' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {gasBubblesSWICase.framework.ANATOMICAL.primaryConcept}
                      </h3>
                      <div className="bg-amber-950/30 rounded-lg p-3 mb-3">
                        <p className="text-amber-200 text-sm font-medium mb-1">Discovery Insight:</p>
                        <p className="text-white/80 text-sm">
                          {gasBubblesSWICase.framework.ANATOMICAL.discoveryInsight}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        {getKnowledgeDepthLabel(knowledgeDepth[0])}
                      </h4>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {knowledgeDepth[0] === 0 && formatText(gasBubblesSWICase.framework.ANATOMICAL.focusedLearning)}
                        {knowledgeDepth[0] === 1 && formatText(gasBubblesSWICase.framework.ANATOMICAL.clinicalApplication)}
                        {knowledgeDepth[0] === 2 && formatText(gasBubblesSWICase.framework.ANATOMICAL.comprehensiveAnalysis)}
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
  selectedCase 
}: ImmersiveConstellationViewerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [knowledgeDepth, setKnowledgeDepth] = useState([1]); // 0=Focused, 1=Clinical, 2=Comprehensive
  const [explorationMode, setExplorationMode] = useState<'free' | 'guided'>('free');
  const [explorationProgress, setExplorationProgress] = useState(33);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTopUI, setShowTopUI] = useState(false);
  const [showLeftUI, setShowLeftUI] = useState(false);
  const [showBottomUI, setShowBottomUI] = useState(false);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const initialNodes: Node[] = [
    {
      id: 'central',
      type: 'custom',
      position: nodePositions.central,
      data: { 
        label: 'Gas Bubbles\nSWI',
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
        label: 'TECHNICAL\nSusceptibility-Weighted Imaging',
        type: 'technical',
        icon: 'settings',
        color: nodeColors.technical,
        framework: gasBubblesSWICase.framework.TECHNICAL
      },
    },
    {
      id: 'clinical',
      type: 'custom',
      position: nodePositions.clinical,
      data: { 
        label: 'CLINICAL\nTimeline-Dependent Significance',
        type: 'clinical',
        icon: 'stethoscope',
        color: nodeColors.clinical,
        framework: gasBubblesSWICase.framework.CLINICAL
      },
    },
    {
      id: 'anatomical',
      type: 'custom',
      position: nodePositions.anatomical,
      data: { 
        label: 'ANATOMICAL\nLocation Suggests Etiology',
        type: 'anatomical',
        icon: 'search',
        color: nodeColors.anatomical,
        framework: gasBubblesSWICase.framework.ANATOMICAL
      },
    },
  ];

  const initialEdges: Edge[] = [
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

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
    if (node.id !== selectedNode) {
      setExplorationProgress(prev => Math.min(prev + 20, 100));
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
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-gray-900 to-black">
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
        />
      </div>
    </ReactFlowProvider>
  );
}
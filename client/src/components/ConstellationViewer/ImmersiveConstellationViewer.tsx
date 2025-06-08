import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, ArrowLeft, Brain, Settings, Stethoscope, Search, Plus, Minus, Maximize, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import CustomNode from './CustomNode';
import { gasBubblesSWICase, nodePositions, nodeColors } from '@/data/curated-cases/gasBubblesSWI';

interface ImmersiveConstellationViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCase: string;
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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  const handleZoomIn = () => {
    // Will be implemented with ReactFlow instance
  };

  const handleZoomOut = () => {
    // Will be implemented with ReactFlow instance
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!isOpen) return null;

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* True Full-Screen React Flow */}
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
          
          {/* Custom Controls with Enhanced Functionality */}
          <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomIn}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomOut}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-xl shadow-2xl"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </ReactFlow>

        {/* Top Hover Area - Exit + Exploration Progress */}
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
                    className="text-white/70 hover:text-white hover:bg-white/10"
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

      {/* Left Hover Area - Knowledge Depth */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-40"
        onMouseEnter={() => setShowLeftUI(true)}
        onMouseLeave={() => setShowLeftUI(false)}
      >
        <AnimatePresence>
          {showLeftUI && (
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl min-w-[280px]"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Knowledge Depth</h3>
                  <div className="space-y-4">
                    <Slider
                      value={knowledgeDepth}
                      onValueChange={setKnowledgeDepth}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Basic</span>
                      <span>Expert</span>
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
                      className={explorationMode === 'free' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    >
                      Free
                    </Button>
                    <Button
                      variant={explorationMode === 'guided' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setExplorationMode('guided')}
                      className={explorationMode === 'guided' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
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

      {/* Bottom Hover Area - Exploration Progress */}
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
                  Exploration Progress
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${explorationProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && selectedNode !== 'central' && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute right-0 top-0 bottom-0 w-96 bg-black/90 backdrop-blur-xl border-l border-white/20 p-6 overflow-y-auto z-50"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedNode === 'technical' && (
                    <div className="bg-blue-600 rounded-lg p-2">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {selectedNode === 'clinical' && (
                    <div className="bg-green-600 rounded-lg p-2">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {selectedNode === 'anatomical' && (
                    <div className="bg-amber-600 rounded-lg p-2">
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
                  className="text-white/70 hover:text-white hover:bg-white/10"
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
                      <p className="text-white/70 text-sm leading-relaxed">
                        {gasBubblesSWICase.framework.TECHNICAL.explanation}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Key Physics</h4>
                      <ul className="space-y-1">
                        {gasBubblesSWICase.framework.TECHNICAL.keyPhysics.map((concept, i) => (
                          <li key={i} className="text-white/70 text-sm">• {concept}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-800/30">
                      <p className="text-blue-200 text-sm">
                        {gasBubblesSWICase.framework.TECHNICAL.whyItMatters}
                      </p>
                    </div>
                  </div>
                )}

                {selectedNode === 'clinical' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {gasBubblesSWICase.framework.CLINICAL.primaryConcept}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Timeline: {gasBubblesSWICase.framework.CLINICAL.timeline}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Clinical Context</h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {gasBubblesSWICase.framework.CLINICAL.context}
                      </p>
                    </div>
                    <div className="bg-green-950/50 rounded-lg p-4 border border-green-800/30">
                      <p className="text-green-200 text-sm">
                        Urgency: {gasBubblesSWICase.framework.CLINICAL.urgency}
                      </p>
                    </div>
                  </div>
                )}

                {selectedNode === 'anatomical' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {gasBubblesSWICase.framework.ANATOMICAL.primaryConcept}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {gasBubblesSWICase.framework.ANATOMICAL.significance}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Key Considerations</h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {gasBubblesSWICase.framework.ANATOMICAL.considerations}
                      </p>
                    </div>
                    <div className="bg-amber-950/50 rounded-lg p-4 border border-amber-800/30">
                      <p className="text-amber-200 text-sm">
                        Location and volume determine whether surgical evacuation or medical management is indicated.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ReactFlowProvider>
  );
}
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
  Background,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, ArrowLeft, Maximize2, Minimize2, Brain, Settings, Stethoscope, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import CustomNode from './CustomNode';
import { gasBubblesSWICase, nodePositions, nodeColors } from '@/data/curated-cases/gasBubblesSWI';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

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
  const [knowledgeDepth, setKnowledgeDepth] = useState([2]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [explorationMode, setExplorationMode] = useState<'standalone' | 'comparison'>('standalone');

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
      type: 'straight',
      style: { stroke: nodeColors.technical, strokeWidth: 3, strokeDasharray: '5,5' },
      animated: true,
    },
    {
      id: 'central-clinical',
      source: 'central',
      sourceHandle: 'right',
      target: 'clinical',
      targetHandle: 'target',
      type: 'straight',
      style: { stroke: nodeColors.clinical, strokeWidth: 3, strokeDasharray: '5,5' },
      animated: true,
    },
    {
      id: 'central-anatomical',
      source: 'central',
      sourceHandle: 'left',
      target: 'anatomical',
      targetHandle: 'target',
      type: 'straight',
      style: { stroke: nodeColors.anatomical, strokeWidth: 3, strokeDasharray: '5,5' },
      animated: true,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    const nodeId = node.id === selectedNode ? null : node.id;
    setSelectedNode(nodeId);
    
    // Smooth zoom and highlight effect
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: nodeId === null || n.id === nodeId || n.id === 'central' ? 1 : 0.4,
          transform: n.id === nodeId ? 'scale(1.15)' : 'scale(1)',
          transition: 'all 0.5s ease-in-out',
        },
      }))
    );
  }, [selectedNode, setNodes]);

  const getKnowledgeContent = (nodeId: string, depth: number) => {
    const framework = gasBubblesSWICase.framework[nodeId.toUpperCase() as keyof typeof gasBubblesSWICase.framework];
    if (!framework) return null;

    switch (depth) {
      case 1: // Focused Learning
        return {
          title: framework.primaryConcept,
          content: (framework as any).explanation || (framework as any).timeline || (framework as any).significance,
        };
      case 2: // Clinical Application
        return {
          title: framework.primaryConcept,
          content: (framework as any).whyItMatters || (framework as any).context || (framework as any).considerations,
          details: (framework as any).keyPhysics || (framework as any).urgency,
        };
      case 3: // Comprehensive Analysis
        return {
          title: framework.primaryConcept,
          content: (framework as any).explanation || (framework as any).timeline || (framework as any).significance,
          details: (framework as any).whyItMatters || (framework as any).context || (framework as any).considerations,
          advanced: (framework as any).keyPhysics || (framework as any).urgency,
        };
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${
          isFullscreen ? '' : 'p-4'
        }`}
      >
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Header Controls */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 flex items-center justify-between p-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Constellation Explorer</h1>
              <p className="text-gray-300">Gas Bubbles on SWI - Immersive Learning</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Case Selection */}
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-blue-600 text-white">
                📋 Gas Bubbles (65M)
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                🔄 Compare Cases
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                ⚠️ Trauma Gas (20M)
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </motion.div>

        {/* Knowledge Depth Slider */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10"
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-center">Knowledge Depth</h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <span className="text-gray-300 text-sm">🔬 Comprehensive</span>
                <Slider
                  value={knowledgeDepth}
                  onValueChange={setKnowledgeDepth}
                  max={3}
                  min={1}
                  step={1}
                  orientation="vertical"
                  className="h-32"
                />
                <span className="text-gray-300 text-sm">🎯 Focused</span>
              </div>
              <div className="text-center">
                <div className="text-white text-xs">
                  {knowledgeDepth[0] === 1 && "Focused Learning"}
                  {knowledgeDepth[0] === 2 && "Clinical Application"}
                  {knowledgeDepth[0] === 3 && "Comprehensive Analysis"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Constellation View */}
        <div className="relative h-full">
          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              selected: node.id === selectedNode
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="constellation-space"
          >
            <Background 
              color="rgba(255,255,255,0.1)" 
              gap={60} 
              size={2}
            />
            <Controls 
              className="!bg-black/30 !border-white/10 !shadow-2xl !rounded-xl !backdrop-blur-sm"
              showInteractive={false}
            />
          </ReactFlow>

          {/* Exploration Panel */}
          <AnimatePresence>
            {selectedNode && selectedNode !== 'central' && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-6 top-6 bottom-6 w-96 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1)} Framework
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedNode(null)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {(() => {
                  const content = getKnowledgeContent(selectedNode, knowledgeDepth[0]);
                  if (!content) return null;

                  return (
                    <motion.div
                      key={`${selectedNode}-${knowledgeDepth[0]}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {content.title}
                        </h3>
                        <p className="text-gray-200 leading-relaxed">
                          {content.content}
                        </p>
                      </div>

                      {content.details && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <h4 className="text-md font-semibold text-white mb-2">
                            Key Details
                          </h4>
                          {Array.isArray(content.details) ? (
                            <ul className="text-gray-200 space-y-1">
                              {content.details.map((detail, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-400 mr-2">•</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-200">{content.details}</p>
                          )}
                        </div>
                      )}

                      {content.advanced && (
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-400/20">
                          <h4 className="text-md font-semibold text-white mb-2">
                            Advanced Insights
                          </h4>
                          {Array.isArray(content.advanced) ? (
                            <ul className="text-gray-200 space-y-1">
                              {content.advanced.map((insight, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-purple-400 mr-2">•</span>
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-200">{content.advanced}</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Progress Indicator */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Exploration Progress:</span>
              <div className="flex space-x-2">
                {['central', 'technical', 'clinical', 'anatomical'].map((nodeId) => (
                  <div
                    key={nodeId}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedNode === nodeId || (nodeId === 'central' && selectedNode)
                        ? 'bg-blue-400 scale-125'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
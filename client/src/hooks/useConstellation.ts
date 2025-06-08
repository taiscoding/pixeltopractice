import { useState, useCallback } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from 'reactflow';
import { gasBubblesSWICase, nodePositions, nodeColors } from '@/data/curated-cases/gasBubblesSWI';

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
    style: { stroke: nodeColors.technical, strokeWidth: 2, strokeDasharray: '5,5' },
    animated: true,
  },
  {
    id: 'central-clinical',
    source: 'central',
    sourceHandle: 'right',
    target: 'clinical',
    targetHandle: 'target',
    type: 'straight',
    style: { stroke: nodeColors.clinical, strokeWidth: 2, strokeDasharray: '5,5' },
    animated: true,
  },
  {
    id: 'central-anatomical',
    source: 'central',
    sourceHandle: 'left',
    target: 'anatomical',
    targetHandle: 'target',
    type: 'straight',
    style: { stroke: nodeColors.anatomical, strokeWidth: 2, strokeDasharray: '5,5' },
    animated: true,
  },
];

export function useConstellation() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
  }, [selectedNode]);

  const highlightNode = useCallback((nodeId: string | null) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: nodeId === null || node.id === nodeId ? 1 : 0.6,
          transform: node.id === nodeId ? 'scale(1.1)' : 'scale(1)',
        },
      }))
    );
  }, [setNodes]);

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    highlightNode,
    setSelectedNode,
  };
}

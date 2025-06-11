import { useState, useCallback, useMemo } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from 'reactflow';
import { CaseData } from '@/data/curated-cases';

const getCentralLabel = (caseName: string) => {
  switch (caseName) {
    case 'Gas Bubbles on SWI':
      return 'Gas Bubbles\nSWI';
    case 'Trauma Gas':
      return 'Trauma Gas\nEmergency';
    case 'Normal Brain':
      return 'Normal Brain\nBaseline';
    default:
      return 'Case\nStudy';
  }
};

const getTechnicalLabel = (caseName: string) => {
  switch (caseName) {
    case 'Gas Bubbles on SWI':
      return 'TECHNICAL\nSusceptibility-Weighted Imaging';
    case 'Trauma Gas':
      return 'TECHNICAL\nVacuum Phenomenon';
    case 'Normal Brain':
      return 'TECHNICAL\nBaseline SWI Reference';
    default:
      return 'TECHNICAL\nImaging Method';
  }
};

const getClinicalLabel = (caseName: string) => {
  switch (caseName) {
    case 'Gas Bubbles on SWI':
      return 'CLINICAL\nTimeline-Dependent Significance';
    case 'Trauma Gas':
      return 'CLINICAL\nEmergency Management';
    case 'Normal Brain':
      return 'CLINICAL\nPsychiatric Workup Baseline';
    default:
      return 'CLINICAL\nPatient Impact';
  }
};

const getAnatomicalLabel = (caseName: string) => {
  switch (caseName) {
    case 'Gas Bubbles on SWI':
      return 'ANATOMICAL\nLocation Suggests Etiology';
    case 'Trauma Gas':
      return 'ANATOMICAL\nVenous Drainage System';
    case 'Normal Brain':
      return 'ANATOMICAL\nNormal Reference Standard';
    default:
      return 'ANATOMICAL\nStructural Context';
  }
};

export function useConstellation(caseData?: CaseData) {
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!caseData) {
      return { initialNodes: [], initialEdges: [] };
    }

    const { case: caseInfo, nodePositions, nodeColors } = caseData;
    
    const nodes: Node[] = [
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
          framework: caseInfo.framework.TECHNICAL
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
          framework: caseInfo.framework.CLINICAL
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
          framework: caseInfo.framework.ANATOMICAL
        },
      },
    ];

    const edges: Edge[] = [
      {
        id: 'central-technical',
        source: 'central',
        sourceHandle: 'top',
        target: 'technical',
        targetHandle: 'target',
        type: 'smoothstep',
        style: { stroke: nodeColors.technical, strokeWidth: 3, strokeDasharray: '8,4' },
        animated: true,
      },
      {
        id: 'central-clinical',
        source: 'central',
        sourceHandle: 'right',
        target: 'clinical',
        targetHandle: 'target',
        type: 'smoothstep',
        style: { stroke: nodeColors.clinical, strokeWidth: 3, strokeDasharray: '8,4' },
        animated: true,
      },
      {
        id: 'central-anatomical',
        source: 'central',
        sourceHandle: 'left',
        target: 'anatomical',
        targetHandle: 'target',
        type: 'smoothstep',
        style: { stroke: nodeColors.anatomical, strokeWidth: 3, strokeDasharray: '8,4' },
        animated: true,
      },
    ];

    return { initialNodes: nodes, initialEdges: edges };
  }, [caseData]);

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

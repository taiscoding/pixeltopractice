import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useConstellation } from '@/hooks/useConstellation';
import CustomNode from './CustomNode';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CaseData } from '@/data/curated-cases';

interface ConstellationViewerProps {
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  caseData?: CaseData;
}

export default function ConstellationViewer({ selectedNode, onNodeSelect, caseData }: ConstellationViewerProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
  } = useConstellation(caseData);

  const memoizedNodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    const nodeId = node.id === selectedNode ? null : node.id;
    onNodeSelect(nodeId);
    onNodeClick(event, node);
  }, [selectedNode, onNodeSelect, onNodeClick]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 h-[600px] relative overflow-hidden border border-gray-800 shadow-xl">
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          selected: node.id === selectedNode
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={memoizedNodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="constellation-grid"
        style={{ background: 'linear-gradient(to bottom right, #0f172a, #000000, #111827)' }}
      >
        <Background color="rgba(148, 163, 184, 0.05)" gap={32} />
        <Controls 
          className="!bg-gray-900/90 !backdrop-blur-sm !border-gray-700 !shadow-2xl !rounded-xl"
          showInteractive={false}
        />
        <MiniMap 
          className="!bg-gray-900/90 !backdrop-blur-sm !border-gray-700 !shadow-2xl !rounded-xl"
          nodeColor={(node) => node.data.color}
          maskColor="rgba(0, 0, 0, 0.3)"
        />
      </ReactFlow>

      {/* Learning Progress Indicator */}
      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-xl rounded-lg p-3 shadow-md border border-gray-700">
        <div className="text-sm font-medium text-gray-300 mb-2">Learning Progress</div>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${selectedNode ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
          <div className={`w-3 h-3 rounded-full ${selectedNode === 'technical' || selectedNode === 'clinical' || selectedNode === 'anatomical' ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
          <div className={`w-3 h-3 rounded-full ${selectedNode === 'anatomical' ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
        </div>
      </div>
    </div>
  );
}

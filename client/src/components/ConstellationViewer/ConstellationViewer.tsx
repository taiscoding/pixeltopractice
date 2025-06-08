import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useConstellation } from '@/hooks/useConstellation';
import CustomNode from './CustomNode';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface ConstellationViewerProps {
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

export default function ConstellationViewer({ selectedNode, onNodeSelect }: ConstellationViewerProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
  } = useConstellation();

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    const nodeId = node.id === selectedNode ? null : node.id;
    onNodeSelect(nodeId);
    onNodeClick(event, node);
  }, [selectedNode, onNodeSelect, onNodeClick]);

  return (
    <div className="bg-gray-50 rounded-2xl p-4 h-[600px] relative overflow-hidden border border-gray-200">
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
        attributionPosition="bottom-left"
        className="constellation-grid"
      >
        <Background color="#e2e8f0" gap={40} />
        <Controls 
          className="!bg-white !border-gray-200 !shadow-lg !rounded-lg"
          showInteractive={false}
        />
        <MiniMap 
          className="!bg-white !border-gray-200 !shadow-lg !rounded-lg"
          nodeColor={(node) => node.data.color}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>

      {/* Learning Progress Indicator */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Learning Progress</div>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${selectedNode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${selectedNode === 'technical' || selectedNode === 'clinical' || selectedNode === 'anatomical' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${selectedNode === 'anatomical' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    </div>
  );
}

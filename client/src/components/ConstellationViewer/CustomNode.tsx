import { Handle, Position } from 'reactflow';
import { Brain, Settings, Stethoscope, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  brain: Brain,
  settings: Settings,
  stethoscope: Stethoscope,
  search: Search,
};

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
    icon: keyof typeof iconMap;
    color: string;
    framework?: any;
  };
  selected?: boolean;
}

export default function CustomNode({ data, selected }: CustomNodeProps) {
  const Icon = iconMap[data.icon];
  const isCentral = data.type === 'central';
  
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: isCentral ? 0 : 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {isCentral ? (
        <>
          <Handle type="source" position={Position.Top} id="top" className="opacity-0" />
          <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
          <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
          <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
        </>
      ) : (
        <>
          <Handle type="target" position={Position.Top} id="target" className="opacity-0" />
          <Handle type="source" position={Position.Bottom} id="source" className="opacity-0" />
        </>
      )}
      
      <div
        className={`
          cursor-pointer transition-all duration-500 backdrop-blur-sm
          ${isCentral 
            ? 'w-36 h-36 rounded-full shadow-2xl border-2 border-white/20' 
            : 'w-56 rounded-2xl shadow-xl border border-white/20 p-5'}
          ${selected 
            ? 'ring-4 ring-white/60 shadow-2xl scale-105 transform' 
            : 'hover:scale-105 hover:shadow-2xl transform'}
        `}
        style={{
          background: isCentral 
            ? `linear-gradient(135deg, ${data.color}, ${data.color}dd)` 
            : `linear-gradient(135deg, ${data.color}ee, ${data.color}dd)`,
          color: 'white',
          boxShadow: selected 
            ? `0 20px 40px ${data.color}40, 0 0 0 1px ${data.color}30` 
            : `0 10px 30px ${data.color}30, 0 0 0 1px ${data.color}20`,
        }}
      >
        <div className={`${isCentral ? 'text-center' : 'flex items-center mb-2'}`}>
          <Icon className={`${isCentral ? 'mx-auto mb-2' : 'mr-3'} h-${isCentral ? '8' : '5'} w-${isCentral ? '8' : '5'}`} />
          {!isCentral && <span className="font-semibold text-sm">{data.label.split('\n')[0]}</span>}
        </div>
        
        {isCentral ? (
          <div className="text-center">
            <div className="text-sm font-semibold">Gas Bubbles</div>
            <div className="text-xs opacity-90">SWI</div>
          </div>
        ) : (
          <div className="text-sm opacity-90">
            <div className="font-medium mb-1">{data.label.split('\n')[1]}</div>
            {data.framework && (
              <div className="text-xs">
                {data.type === 'technical' && 'T2* effects, blooming artifacts'}
                {data.type === 'clinical' && '<1 week normal post-op'}
                {data.type === 'anatomical' && 'Surgical site vs remote location'}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

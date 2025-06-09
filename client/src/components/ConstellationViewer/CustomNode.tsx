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
    caseName?: string;
    subtext?: string;
  };
  selected?: boolean;
}

export default function CustomNode({ data, selected }: CustomNodeProps) {
  const Icon = iconMap[data.icon];
  const isCentral = data.type === 'central';
  
  // Get accent colors based on node type
  const getAccentColors = (type: string) => {
    switch (type) {
      case 'central':
        return {
          border: 'border-purple-500/80',
          bg: 'bg-purple-500/20',
          ring: 'ring-purple-500/60',
          borderHover: 'hover:border-purple-400/70'
        };
      case 'technical':
        return {
          border: 'border-blue-500/80',
          bg: 'bg-blue-500/20',
          ring: 'ring-blue-500/60',
          borderHover: 'hover:border-blue-400/70'
        };
      case 'clinical':
        return {
          border: 'border-green-500/80',
          bg: 'bg-green-500/20',
          ring: 'ring-green-500/60',
          borderHover: 'hover:border-green-400/70'
        };
      case 'anatomical':
        return {
          border: 'border-amber-500/80',
          bg: 'bg-amber-500/20',
          ring: 'ring-amber-500/60',
          borderHover: 'hover:border-amber-400/70'
        };
      default:
        return {
          border: 'border-gray-700',
          bg: 'bg-gray-900/80',
          ring: 'ring-orange-500/60',
          borderHover: 'hover:border-orange-400/50'
        };
    }
  };

  const accentColors = getAccentColors(data.type);
  
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
          cursor-pointer transition-all duration-500 backdrop-blur-xl border
          ${accentColors.bg} ${accentColors.border}
          ${isCentral 
            ? 'w-36 h-36 rounded-full shadow-2xl flex flex-col items-center justify-center' 
            : 'w-56 rounded-2xl shadow-xl p-5'}
          ${selected 
            ? `ring-4 ${accentColors.ring} shadow-2xl scale-105 transform` 
            : `hover:scale-105 hover:shadow-2xl transform ${accentColors.borderHover}`}
        `}
        style={{
          color: 'white',
          boxShadow: selected 
            ? `0 20px 40px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.2)` 
            : `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(107, 114, 128, 0.2)`,
        }}
      >
        {isCentral ? (
          <>
            <Icon className="h-8 w-8 mb-2" />
            <div className="text-center">
              <div className="text-sm font-semibold">{data.label.split('\n')[0]}</div>
              <div className="text-xs opacity-90">{data.label.split('\n')[1]}</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mb-2">
              <Icon className="mr-3 h-5 w-5" />
              <span className="font-semibold text-sm">{data.label.split('\n')[0]}</span>
            </div>
            <div className="text-sm opacity-90">
              <div className="font-medium mb-1">{data.label.split('\n')[1]}</div>
              {data.framework && data.subtext && (
                <div className="text-xs">
                  {data.subtext}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Grip, X, Eye, EyeOff } from 'lucide-react';
import { useWidgets, WidgetType } from '../../contexts/WidgetContext';

interface DashboardWidgetProps {
  id: WidgetType;
  title: string;
  children: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  children,
  onDragStart,
  onDragEnd,
}) => {
  const { toggleWidgetVisibility } = useWidgets();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm rounded-none overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div 
            className="cursor-move mr-2 text-gray-400 hover:text-gray-600 transition"
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
          >
            <Grip size={16} />
          </div>
          <h3 className="text-lg font-zen text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => toggleWidgetVisibility(id)}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Remove widget"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};
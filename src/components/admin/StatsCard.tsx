import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  return (
    <div className={`bg-white p-6 shadow-lg rounded-none border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-zen">{value}</p>
          {change && (
            <p className={`text-sm ${
              change.type === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {change.type === 'increase' ? '+' : '-'}{change.value}%
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
      </div>
    </div>
  );
};
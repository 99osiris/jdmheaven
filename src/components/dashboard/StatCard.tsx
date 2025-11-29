import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  glow?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = 'neutral',
  glow = false,
}) => {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="elevated" hover glow={glow} padding="md" className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-text-secondary mb-1">{title}</p>
            <p className="text-3xl font-zen font-bold text-text-primary">{value}</p>
          </div>
          {Icon && (
            <div className="p-3 bg-racing-red-alpha rounded-none">
              <Icon className="w-6 h-6 text-racing-red" />
            </div>
          )}
        </div>
        {(change !== undefined || changeLabel) && (
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            {TrendIcon && <TrendIcon className="w-4 h-4" />}
            {change !== undefined && (
              <span className="font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            {changeLabel && <span className="ml-1">{changeLabel}</span>}
          </div>
        )}
      </Card>
    </motion.div>
  );
};


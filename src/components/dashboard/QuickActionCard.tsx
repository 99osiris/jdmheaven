import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

export interface QuickActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  glow?: boolean;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'primary',
  glow = false,
}) => {
  const variantStyles = {
    primary: 'bg-gradient-racing text-white hover:shadow-glow-lg',
    secondary: 'bg-midnight-light text-text-primary hover:bg-midnight-lighter',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card
        variant="elevated"
        padding="lg"
        glow={glow}
        className={`${variantStyles[variant]} transition-base h-full`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 mb-4 ${variant === 'primary' ? 'bg-white/20' : 'bg-racing-red-alpha'} rounded-none`}>
            <Icon className={`w-8 h-8 ${variant === 'primary' ? 'text-white' : 'text-racing-red'}`} />
          </div>
          <h3 className="font-zen text-lg font-bold mb-1">{title}</h3>
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
      </Card>
    </motion.div>
  );
};


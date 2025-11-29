import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'bordered' | 'flat';
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  elevated: 'bg-midnight-light shadow-lg',
  bordered: 'bg-midnight-light border border-charcoal',
  flat: 'bg-midnight-light',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  hover = false,
  glow = false,
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-none transition-base';
  const variantClass = variantStyles[variant];
  const paddingClass = paddingStyles[padding];
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const glowClass = glow ? 'shadow-glow hover:shadow-glow-lg' : '';

  const content = (
    <div className={`${baseStyles} ${variantClass} ${paddingClass} ${hoverClass} ${glowClass} ${className}`} {...props}>
      {children}
    </div>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-xl font-zen font-bold text-text-primary ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-sm text-text-secondary mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`mt-4 pt-4 border-t border-charcoal ${className}`} {...props}>
    {children}
  </div>
);


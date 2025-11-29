import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}) => {
  const baseStyles = 'bg-charcoal';
  const variantStyles = {
    text: 'h-4 rounded-none',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };
  const animationStyles = {
    pulse: 'animate-pulse-slow',
    wave: 'animate-pulse',
    none: '',
  };

  const customStyle: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? undefined : '1em'),
    ...style,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={customStyle}
      {...props}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" width={i === lines - 1 ? '80%' : '100%'} />
    ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-midnight-light p-6 space-y-4">
    <Skeleton variant="rectangular" height={200} />
    <SkeletonText lines={2} />
    <div className="flex gap-2">
      <Skeleton variant="rectangular" width="30%" height={32} />
      <Skeleton variant="rectangular" width="30%" height={32} />
    </div>
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton variant="circular" width={size} height={size} />
);


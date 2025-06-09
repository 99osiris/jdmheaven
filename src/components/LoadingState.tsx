import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light' | 'dark';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'text-racing-red',
    light: 'text-white',
    dark: 'text-midnight'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-black/50 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <Loader2 
          className={`animate-spin mx-auto mb-2 ${sizeClasses[size]} ${variantClasses[variant]}`}
        />
        {message && (
          <p className={`text-sm ${variantClasses[variant]}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}; 
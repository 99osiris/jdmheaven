import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

const variantStyles = {
  primary: 'bg-racing-red text-white hover:bg-racing-red-dark active:bg-racing-red-dark',
  secondary: 'bg-midnight-light text-white hover:bg-midnight-lighter active:bg-charcoal',
  ghost: 'bg-transparent text-text-primary hover:bg-midnight-light active:bg-midnight-lighter',
  danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700',
  outline: 'border-2 border-racing-red text-racing-red bg-transparent hover:bg-racing-red-alpha active:bg-racing-red-alpha',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  glow = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-zen font-semibold rounded-none transition-fast inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-ring';
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const widthClass = fullWidth ? 'w-full' : '';
  const glowClass = glow ? 'shadow-glow hover:shadow-glow-lg' : '';

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${glowClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};


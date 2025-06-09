import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorBoundary';
import { toast } from './Toast';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  name?: string;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
  fallback,
  onReset,
  name = 'component'
}) => {
  const handleError = (error: Error) => {
    console.error(`Error in ${name}:`, error);
    toast.error(`An error occurred in ${name}. Our team has been notified.`);
  };

  const handleReset = () => {
    // Clear any error-related state
    localStorage.removeItem(`error_state_${name}`);
    sessionStorage.removeItem(`error_state_${name}`);
    
    // Call custom reset handler if provided
    onReset?.();
  };

  return (
    <ErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}; 
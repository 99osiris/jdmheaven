import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from './Toast';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();

  const handleReset = () => {
    // Clear any cached state that might be causing the error
    localStorage.removeItem('app_error_state');
    sessionStorage.clear();
    resetErrorBoundary();
  };

  const handleGoHome = () => {
    handleReset();
    navigate('/');
  };

  React.useEffect(() => {
    // Log error to your error tracking service
    console.error('Application error:', error);
    
    // Show error toast
    toast.error('An unexpected error occurred. Our team has been notified.');
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <AlertTriangle className="w-8 h-8 text-racing-red" />
        </div>
        
        <h2 className="text-2xl font-zen text-gray-900 mb-4">Oops! Something went wrong</h2>
        
        <div className="bg-gray-50 rounded-none p-4 mb-6">
          <p className="text-sm font-mono text-gray-600 break-all">
            {error.message}
          </p>
        </div>

        <p className="text-gray-600 mb-8">
          Don't worry, we've been notified and are working on fixing this issue.
          In the meantime, you can try:
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try again
          </button>
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-midnight text-white rounded-none hover:bg-gray-900 transition font-zen"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
  onError?: (error: Error, info: { componentStack: string }) => void
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ReactErrorBoundary 
        FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
        onError={onError}
        onReset={() => {
          // Clear any error state when the error boundary resets
          localStorage.removeItem('app_error_state');
          sessionStorage.clear();
        }}
      >
        <Component {...props} />
      </ReactErrorBoundary>
    );
  };
}

export { ErrorFallback };
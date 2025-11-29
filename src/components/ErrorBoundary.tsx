import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-white dark:bg-midnight flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-none mb-6 border-2 border-racing-red"
        >
          <AlertTriangle className="w-12 h-12 text-racing-red" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-zen text-midnight dark:text-white mb-4">
          Oops! Something went wrong
        </h2>
        
        {/* Error Message */}
        {import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-none p-4 mb-6 border border-gray-200 dark:border-gray-700 max-w-lg mx-auto"
          >
            <p className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all whitespace-pre-wrap">
              {error.message}
            </p>
          </motion.div>
        )}

        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          Don't worry, we've been notified and are working on fixing this issue.
          In the meantime, you can try:
        </p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-midnight dark:bg-gray-800 text-white rounded-none hover:bg-gray-900 dark:hover:bg-gray-700 transition font-zen"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Try these:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/inventory"
              className="text-racing-red hover:text-red-700 dark:hover:text-red-400 transition text-sm font-zen underline"
            >
              Browse Inventory
            </Link>
            <Link
              to="/contact"
              className="text-racing-red hover:text-red-700 dark:hover:text-red-400 transition text-sm font-zen underline"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </motion.div>
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
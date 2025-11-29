import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, Home, ChevronLeft, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Error page component for React Router errorElement
 * Matches the JDM Heaven design system
 */
export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Determine error details
  const isRouteError = isRouteErrorResponse(error);
  const status = isRouteError ? error.status : 500;
  const statusText = isRouteError ? error.statusText : 'Internal Server Error';
  const message = isRouteError 
    ? error.data?.message || error.statusText || 'Something went wrong'
    : error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';

  // Get user-friendly error message based on status
  const getErrorMessage = () => {
    switch (status) {
      case 404:
        return {
          title: 'Page Not Found',
          description: "The page you're looking for doesn't exist or has been moved.",
          icon: '🔍',
        };
      case 403:
        return {
          title: 'Access Denied',
          description: "You don't have permission to access this page.",
          icon: '🚫',
        };
      case 500:
        return {
          title: 'Server Error',
          description: 'Our servers encountered an error. We\'re working on fixing it.',
          icon: '⚙️',
        };
      default:
        return {
          title: 'Oops! Something went wrong',
          description: 'An unexpected error occurred. Our team has been notified.',
          icon: '⚠️',
        };
    }
  };

  const errorInfo = getErrorMessage();

  const handleReset = () => {
    // Clear any cached state
    localStorage.removeItem('app_error_state');
    sessionStorage.clear();
    // Reload the page
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-midnight flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Error Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-none mb-6 border-2 border-racing-red"
          >
            <AlertTriangle className="w-12 h-12 text-racing-red" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-zen text-midnight dark:text-white mb-4">
            {errorInfo.title}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            {errorInfo.description}
          </p>
          
          {status && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              Error {status}: {statusText}
            </p>
          )}
        </div>

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-none p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start">
              <Wrench className="w-5 h-5 text-racing-red mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-zen text-gray-900 dark:text-white mb-2">
                  Error Details (Development Mode)
                </h3>
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all whitespace-pre-wrap">
                  {message}
                </p>
                {error instanceof Error && error.stack && (
                  <details className="mt-4">
                    <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-racing-red transition">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto max-h-48 p-3 bg-gray-100 dark:bg-gray-900 rounded-none">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-midnight dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-none hover:border-racing-red dark:hover:border-racing-red transition font-zen"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-midnight dark:bg-gray-800 text-white rounded-none hover:bg-gray-900 dark:hover:bg-gray-700 transition font-zen"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
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
            <Link
              to="/about"
              className="text-racing-red hover:text-red-700 dark:hover:text-red-400 transition text-sm font-zen underline"
            >
              About Us
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;


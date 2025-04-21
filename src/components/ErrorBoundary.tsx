import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-racing-red" />
        </div>
        <h2 className="text-2xl font-zen text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ReactErrorBoundary FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}>
        <Component {...props} />
      </ReactErrorBoundary>
    );
  };
}

export { ErrorFallback }
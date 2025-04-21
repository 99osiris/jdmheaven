import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CMSFallbackProps {
  error?: string;
  children: React.ReactNode;
}

export const CMSFallback: React.FC<CMSFallbackProps> = ({ 
  error = 'Content could not be loaded', 
  children 
}) => {
  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 bg-red-50 border-l-4 border-red-400 p-4 shadow-lg max-w-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-500 mt-1">
              Showing fallback content. CMS connection issue.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
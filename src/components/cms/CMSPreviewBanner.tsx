import React from 'react';
import { Eye, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const CMSPreviewBanner: React.FC = () => {
  const [dismissed, setDismissed] = useLocalStorage('cms-preview-dismissed', false);
  const isPreview = new URLSearchParams(window.location.search).has('preview');
  
  if (dismissed || !isPreview) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-3 z-50 flex items-center justify-between">
      <div className="flex items-center">
        <Eye className="w-5 h-5 mr-2 text-racing-red" />
        <span>You're viewing a preview from the CMS</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-white hover:text-racing-red"
        aria-label="Dismiss preview banner"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
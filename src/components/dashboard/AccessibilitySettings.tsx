import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Type, Contrast, MousePointer } from 'lucide-react';
import { toast } from '../../components/Toast';

export const AccessibilitySettings: React.FC = () => {
  const { 
    textSize, 
    setTextSize, 
    highContrast, 
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion
  } = useAccessibility();

  const handleTextSizeChange = (size: 'small' | 'medium' | 'large') => {
    setTextSize(size);
    toast.success(`Text size changed to ${size}`);
  };

  const handleContrastToggle = () => {
    toggleHighContrast();
    toast.success(`High contrast mode ${highContrast ? 'disabled' : 'enabled'}`);
  };

  const handleMotionToggle = () => {
    toggleReducedMotion();
    toast.success(`Reduced motion ${reducedMotion ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-zen mb-6">Accessibility Settings</h3>
      
      <div className="space-y-8">
        {/* Text Size */}
        <div>
          <div className="flex items-center mb-4">
            <Type className="w-5 h-5 text-racing-red mr-2" />
            <h4 className="font-zen">Text Size</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleTextSizeChange('small')}
              className={`p-3 border ${
                textSize === 'small' 
                  ? 'border-racing-red bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition text-center`}
            >
              <span className="text-sm">Small</span>
            </button>
            
            <button
              onClick={() => handleTextSizeChange('medium')}
              className={`p-3 border ${
                textSize === 'medium' 
                  ? 'border-racing-red bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition text-center`}
            >
              <span className="text-base">Medium</span>
            </button>
            
            <button
              onClick={() => handleTextSizeChange('large')}
              className={`p-3 border ${
                textSize === 'large' 
                  ? 'border-racing-red bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition text-center`}
            >
              <span className="text-lg">Large</span>
            </button>
          </div>
        </div>
        
        {/* High Contrast */}
        <div>
          <div className="flex items-center mb-4">
            <Contrast className="w-5 h-5 text-racing-red mr-2" />
            <h4 className="font-zen">Display Options</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200">
              <div>
                <h5 className="font-medium">High Contrast Mode</h5>
                <p className="text-sm text-gray-500">Increase contrast for better readability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={highContrast}
                  onChange={handleContrastToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-racing-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-racing-red"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200">
              <div>
                <h5 className="font-medium">Reduced Motion</h5>
                <p className="text-sm text-gray-500">Minimize animations and transitions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={reducedMotion}
                  onChange={handleMotionToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-racing-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-racing-red"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
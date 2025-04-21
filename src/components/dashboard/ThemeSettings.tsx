import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { toast } from '../../components/Toast';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-zen mb-6">Theme Settings</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-4 border ${
            theme === 'light' 
              ? 'border-racing-red bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          } transition flex flex-col items-center`}
        >
          <Sun className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-racing-red' : 'text-gray-400'}`} />
          <span className={`font-zen ${theme === 'light' ? 'text-racing-red' : 'text-gray-600'}`}>
            Light Mode
          </span>
        </button>
        
        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-4 border ${
            theme === 'dark' 
              ? 'border-racing-red bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          } transition flex flex-col items-center`}
        >
          <Moon className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-racing-red' : 'text-gray-400'}`} />
          <span className={`font-zen ${theme === 'dark' ? 'text-racing-red' : 'text-gray-600'}`}>
            Dark Mode
          </span>
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        Choose between light and dark theme for your dashboard.
      </p>
    </div>
  );
};
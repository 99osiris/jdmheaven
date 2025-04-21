import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { toast } from '../../components/Toast';

export const LanguageSettings: React.FC = () => {
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    toast.success(`Language changed to ${langCode.toUpperCase()}`);
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-zen mb-6">{t('language')} Settings</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`p-4 border ${
              language === lang.code 
                ? 'border-racing-red bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'
            } transition flex flex-col items-center`}
          >
            <Globe className={`w-6 h-6 mb-2 ${language === lang.code ? 'text-racing-red' : 'text-gray-400'}`} />
            <span className={`font-zen ${language === lang.code ? 'text-racing-red' : 'text-gray-600'}`}>
              {t(lang.code)}
            </span>
          </button>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        Choose your preferred language for the dashboard interface.
      </p>
    </div>
  );
};
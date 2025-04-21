import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Define available languages
export type Language = 'en' | 'nl' | 'de' | 'fr';

// Define translations interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Basic translations
const translations: Translations = {
  en: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    profile: 'Profile',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    english: 'English',
    dutch: 'Dutch',
    german: 'German',
    french: 'French',
  },
  nl: {
    dashboard: 'Dashboard',
    settings: 'Instellingen',
    theme: 'Thema',
    language: 'Taal',
    darkMode: 'Donkere Modus',
    lightMode: 'Lichte Modus',
    profile: 'Profiel',
    logout: 'Uitloggen',
    save: 'Opslaan',
    cancel: 'Annuleren',
    english: 'Engels',
    dutch: 'Nederlands',
    german: 'Duits',
    french: 'Frans',
  },
  de: {
    dashboard: 'Dashboard',
    settings: 'Einstellungen',
    theme: 'Thema',
    language: 'Sprache',
    darkMode: 'Dunkelmodus',
    lightMode: 'Lichtmodus',
    profile: 'Profil',
    logout: 'Abmelden',
    save: 'Speichern',
    cancel: 'Abbrechen',
    english: 'Englisch',
    dutch: 'Niederländisch',
    german: 'Deutsch',
    french: 'Französisch',
  },
  fr: {
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    theme: 'Thème',
    language: 'Langue',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    profile: 'Profil',
    logout: 'Déconnexion',
    save: 'Enregistrer',
    cancel: 'Annuler',
    english: 'Anglais',
    dutch: 'Néerlandais',
    german: 'Allemand',
    french: 'Français',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  availableLanguages: [],
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  const availableLanguages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'nl' as Language, name: 'Nederlands' },
    { code: 'de' as Language, name: 'Deutsch' },
    { code: 'fr' as Language, name: 'Français' },
  ];

  // Translation function
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    // Return the key if no translation found
    return key;
  };

  // Set lang attribute on html element
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};
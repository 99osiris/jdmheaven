import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type TextSize = 'small' | 'medium' | 'large';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  textSize: 'medium',
  setTextSize: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSize] = useLocalStorage<TextSize>('text-size', 'medium');
  const [highContrast, setHighContrast] = useLocalStorage<boolean>('high-contrast', false);
  const [reducedMotion, setReducedMotion] = useLocalStorage<boolean>('reduced-motion', false);

  // Apply text size to document
  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
  }, [textSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Apply reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  // Check system preferences on mount
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReducedMotion(true);
    }

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
      setHighContrast(true);
    }
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        toggleHighContrast,
        reducedMotion,
        toggleReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
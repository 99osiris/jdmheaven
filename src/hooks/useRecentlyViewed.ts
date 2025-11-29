import { useState, useEffect } from 'react';
import type { Car } from '../types';

const STORAGE_KEY = 'jdmheaven_recently_viewed';
const MAX_ITEMS = 8;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Car[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  const addToRecentlyViewed = (car: Car) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((c) => c.id !== car.id);
      // Add to beginning
      const updated = [car, ...filtered].slice(0, MAX_ITEMS);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
};


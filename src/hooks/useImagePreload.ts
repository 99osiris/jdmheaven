import { useState, useEffect } from 'react';

export const useImagePreload = (imageSrcs: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = reject;
      });
    };

    const preloadAll = async () => {
      try {
        await Promise.all(imageSrcs.map(preloadImage));
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadAll();
  }, [imageSrcs]);

  return loadedImages;
};
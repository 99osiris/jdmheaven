import { useEffect } from 'react';

/**
 * Hook to prefetch resources (pages, images, etc.)
 * @param urls Array of URLs to prefetch
 * @param type Type of resource to prefetch ('page', 'image', 'style', 'script', 'font')
 */
export const usePrefetch = (
  urls: string[],
  type: 'page' | 'image' | 'style' | 'script' | 'font' = 'page'
) => {
  useEffect(() => {
    if (!urls.length || !('requestIdleCallback' in window)) return;

    // Use requestIdleCallback to prefetch during browser idle time
    const id = window.requestIdleCallback(() => {
      urls.forEach(url => {
        switch (type) {
          case 'page':
            // Prefetch page
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = 'document';
            document.head.appendChild(link);
            break;
          
          case 'image':
            // Preload image
            const img = new Image();
            img.src = url;
            break;
          
          case 'style':
            // Prefetch CSS
            const styleLink = document.createElement('link');
            styleLink.rel = 'prefetch';
            styleLink.href = url;
            styleLink.as = 'style';
            document.head.appendChild(styleLink);
            break;
          
          case 'script':
            // Prefetch JS
            const scriptLink = document.createElement('link');
            scriptLink.rel = 'prefetch';
            scriptLink.href = url;
            scriptLink.as = 'script';
            document.head.appendChild(scriptLink);
            break;
          
          case 'font':
            // Prefetch font
            const fontLink = document.createElement('link');
            fontLink.rel = 'prefetch';
            fontLink.href = url;
            fontLink.as = 'font';
            fontLink.crossOrigin = 'anonymous';
            document.head.appendChild(fontLink);
            break;
        }
      });
    });

    return () => {
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
      }
    };
  }, [urls, type]);
};
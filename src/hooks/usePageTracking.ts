import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    analytics.pageView(location.pathname + location.search, document.title);

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (scrollPercent >= 75) {
          analytics.scrollDepth(location.pathname, scrollPercent);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track time on page when leaving
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.timeOnPage(location.pathname, timeSpent);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);
};


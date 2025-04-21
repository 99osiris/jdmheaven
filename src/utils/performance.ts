/**
 * Measures and reports performance metrics
 */
export const measurePerformance = (metricName: string) => {
  if (!window.performance || !window.performance.mark) {
    return null;
  }

  try {
    // Create a unique ID for this measurement
    const id = `${metricName}-${Date.now()}`;
    
    // Start the measurement
    window.performance.mark(`${id}-start`);
    
    return {
      end: () => {
        try {
          // End the measurement
          window.performance.mark(`${id}-end`);
          
          // Measure between the two marks
          window.performance.measure(
            metricName,
            `${id}-start`,
            `${id}-end`
          );
          
          // Get the measurement
          const entries = window.performance.getEntriesByName(metricName);
          const duration = entries.length > 0 ? entries[entries.length - 1].duration : 0;
          
          // Log the measurement
          console.log(`${metricName}: ${duration.toFixed(2)}ms`);
          
          // Clear the marks and measures to avoid memory leaks
          try {
            window.performance.clearMarks(`${id}-start`);
            window.performance.clearMarks(`${id}-end`);
            window.performance.clearMeasures(metricName);
          } catch (e) {
            // Ignore errors from clearing marks/measures
          }
          
          return duration;
        } catch (error) {
          console.warn(`Error ending performance measurement for ${metricName}:`, error);
          return 0;
        }
      }
    };
  } catch (error) {
    console.warn(`Error starting performance measurement for ${metricName}:`, error);
    return null;
  }
};

/**
 * Defers non-critical operations until the browser is idle
 */
export const deferOperation = (operation: () => void, timeout = 2000) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => operation(), { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(operation, 1);
  }
};

/**
 * Loads a script dynamically with proper attributes
 */
export const loadScript = (
  src: string, 
  { async = true, defer = true, id, onLoad }: { 
    async?: boolean; 
    defer?: boolean; 
    id?: string; 
    onLoad?: () => void;
  } = {}
) => {
  const script = document.createElement('script');
  script.src = src;
  if (async) script.async = true;
  if (defer) script.defer = true;
  if (id) script.id = id;
  if (onLoad) script.onload = onLoad;
  
  document.head.appendChild(script);
  
  return {
    remove: () => {
      document.head.removeChild(script);
    }
  };
};

/**
 * Checks if the browser supports modern features
 */
export const checkBrowserSupport = () => {
  return {
    intersectionObserver: 'IntersectionObserver' in window,
    webp: document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0,
    webgl: (() => {
      try {
        return !!window.WebGLRenderingContext && 
          !!document.createElement('canvas').getContext('webgl');
      } catch (e) {
        return false;
      }
    })(),
    serviceWorker: 'serviceWorker' in navigator,
    webShare: 'share' in navigator,
    webStorage: 'localStorage' in window && 'sessionStorage' in window,
    webWorker: 'Worker' in window,
  };
};
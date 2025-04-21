import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface Metric {
  name: string;
  value: number;
  unit: string;
}

export const PerformanceMetrics: React.FC<{ visible?: boolean }> = ({ visible = false }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const updateMetrics = () => {
      if (window.performance && window.performance.getEntriesByType) {
        // Get navigation timing metrics
        const navigationEntries = window.performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navTiming = navigationEntries[0] as PerformanceNavigationTiming;
          
          const newMetrics: Metric[] = [
            { 
              name: 'Page Load', 
              value: Math.round(navTiming.loadEventEnd - navTiming.startTime), 
              unit: 'ms' 
            },
            { 
              name: 'DOM Content', 
              value: Math.round(navTiming.domContentLoadedEventEnd - navTiming.startTime), 
              unit: 'ms' 
            },
            { 
              name: 'First Paint', 
              value: Math.round(navTiming.responseEnd - navTiming.requestStart), 
              unit: 'ms' 
            },
          ];
          
          setMetrics(newMetrics);
        }
      }
    };

    // Update metrics when the page loads
    window.addEventListener('load', updateMetrics);
    
    // Also update metrics now if the page is already loaded
    if (document.readyState === 'complete') {
      updateMetrics();
    }

    return () => {
      window.removeEventListener('load', updateMetrics);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-midnight text-white p-2 rounded-full shadow-lg"
      >
        <Activity className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-midnight text-white p-4 rounded-none shadow-lg w-64">
          <h3 className="text-sm font-zen mb-2">Performance Metrics</h3>
          <div className="space-y-2">
            {metrics.map((metric) => (
              <div key={metric.name} className="flex justify-between text-xs">
                <span>{metric.name}:</span>
                <span className="font-mono">
                  {metric.value} {metric.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
import React, { Suspense, lazy, ComponentType } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  props?: Record<string, any>;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback = <div className="animate-pulse h-40 bg-gray-200 rounded-none"></div>,
  threshold = 0.1,
  rootMargin = '200px',
  props = {},
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  // Only load the component when it's visible or about to be visible
  const Component = isVisible ? lazy(component) : null;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {isVisible && Component ? (
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};
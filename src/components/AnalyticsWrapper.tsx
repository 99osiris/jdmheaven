import { useEffect } from 'react';
import { usePageTracking } from '../hooks/usePageTracking';

export const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};


import { useEffect, useState } from 'react';
import { getConnectionStatus, testSupabaseConnection, type ConnectionStatus } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function ConnectionStatus({ showDetails = false, className = '' }: ConnectionStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>(getConnectionStatus());
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      setTesting(true);
      try {
        const result = await testSupabaseConnection();
        setStatus(result);
      } catch (error) {
        console.error('Connection test failed:', error);
      } finally {
        setTesting(false);
      }
    };

    // Test on mount
    testConnection();

    // Test periodically (every 30 seconds)
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (testing) {
      return <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />;
    }
    if (status.connected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status.configured) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (testing) return 'Testing...';
    if (status.connected) return 'Connected';
    if (status.configured) return 'Configured';
    return 'Not Configured';
  };

  const getStatusColor = () => {
    if (status.connected) return 'text-green-600';
    if (status.configured) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        Supabase: {getStatusText()}
      </span>
      {showDetails && status.error && (
        <span className="text-xs text-gray-500 ml-2">{status.error}</span>
      )}
    </div>
  );
}


import { useEffect, useState } from 'react';
import { supabase, testSupabaseConnection, getConnectionStatus, type ConnectionStatus } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    try {
      const status = await testSupabaseConnection();
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus({
        connected: false,
        configured: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    // Get initial status
    const initialStatus = getConnectionStatus();
    setConnectionStatus(initialStatus);

    // Test connection
    testConnection();

    // Fetch submissions if connected
    async function fetchSubmissions() {
      if (!connectionStatus?.connected) return;
      
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.warn('Failed to fetch submissions:', error);
          return;
        }
        setSubmissions(data || []);
      } catch (err) {
        console.warn('Error fetching submissions:', err);
      }
    }

    // Wait a bit for connection test, then fetch
    const timer = setTimeout(() => {
      if (connectionStatus?.connected) {
        fetchSubmissions();
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Refetch submissions when connection status changes
  useEffect(() => {
    if (connectionStatus?.connected) {
      supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data, error }) => {
          if (!error && data) {
            setSubmissions(data);
          }
        });
    }
  }, [connectionStatus?.connected]);

  if (loading && !connectionStatus) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-gray-500" />
          <p>Checking connection...</p>
        </div>
      </div>
    );
  }

  const status = connectionStatus || getConnectionStatus();
  const isConnected = status.connected;
  const isConfigured = status.configured;

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      {/* Connection Status */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Supabase Connection Status</h2>
          <button
            onClick={testConnection}
            disabled={testing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Status Indicator */}
          <div className={`flex items-center gap-3 p-4 rounded-lg ${
            isConnected 
              ? 'bg-green-50 border border-green-200' 
              : isConfigured 
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
          }`}>
            {isConnected ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : isConfigured ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <div className="flex-1">
              <p className={`font-semibold ${
                isConnected ? 'text-green-800' : isConfigured ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {isConnected 
                  ? '✅ Connected' 
                  : isConfigured 
                    ? '⚠️ Configured but not connected'
                    : '❌ Not Configured'}
              </p>
              {status.error && (
                <p className="text-sm mt-1 text-gray-600">{status.error}</p>
              )}
            </div>
          </div>

          {/* Configuration Details */}
          {status.details && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Configuration Details
              </h3>
              <div className="text-sm space-y-1 font-mono">
                <p>
                  <span className="text-gray-600">URL:</span>{' '}
                  <span className={status.details.url !== 'Not set' ? 'text-green-700' : 'text-red-700'}>
                    {status.details.url || 'Not set'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">API Key:</span>{' '}
                  <span className={status.details.hasKey ? 'text-green-700' : 'text-red-700'}>
                    {status.details.hasKey ? `Set (${status.details.keyLength} chars)` : 'Not set'}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          {!isConfigured && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Create a <code className="bg-blue-100 px-1 rounded">.env</code> file in the project root</li>
                <li>Add your Supabase credentials:
                  <pre className="mt-2 bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                  </pre>
                </li>
                <li>Get your credentials from: <a href="https://app.supabase.com/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                <li>Restart the development server after adding the .env file</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Test Data */}
      {isConnected && (
        <div>
          <h2 className="text-lg font-bold mb-4">Recent Contact Submissions (Test Data):</h2>
          {submissions.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-600">
              <p>No submissions found</p>
              <p className="text-sm mt-1">This is normal if the table doesn't exist or is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Name:</strong> {submission.name}</p>
                    <p><strong>Email:</strong> {submission.email}</p>
                    <p className="col-span-2"><strong>Message:</strong> {submission.message}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{submission.status}</span></p>
                    <p><strong>Created:</strong> {new Date(submission.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test connection
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('contact_submissions').select('count');
        if (error) throw error;
        setIsConnected(true);
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase');
      }
    }

    // Fetch submissions
    async function fetchSubmissions() {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setSubmissions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      }
    }

    testConnection();
    fetchSubmissions();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <h2 className="font-bold">Error:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Supabase Connection Status:</h2>
        <p className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected === null ? 'Checking...' : isConnected ? 'Connected' : 'Not Connected'}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Recent Submissions:</h2>
        {submissions.length === 0 ? (
          <p>No submissions found</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="p-4 bg-gray-100 rounded-md"
              >
                <p><strong>Name:</strong> {submission.name}</p>
                <p><strong>Email:</strong> {submission.email}</p>
                <p><strong>Message:</strong> {submission.message}</p>
                <p><strong>Status:</strong> {submission.status}</p>
                <p><strong>Created:</strong> {new Date(submission.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
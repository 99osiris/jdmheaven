import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sanityClient } from '../lib/sanity';
import { triggerSync } from '../lib/sync/webhook-handler';
import { toast } from './Toast';
import groq from 'groq';

interface SyncStatus {
  sanityCount: number;
  supabaseCount: number;
  lastSync?: string;
  errors: string[];
}

export const SyncDiagnostics: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>({
    sanityCount: 0,
    supabaseCount: 0,
    errors: [],
  });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    const errors: string[] = [];

    try {
      // Count Sanity cars
      let sanityCount = 0;
      try {
        const sanityCars = await sanityClient.fetch<{ _id: string }[]>(
          groq`*[_type == "car"]{ _id }`
        );
        sanityCount = sanityCars?.length || 0;
      } catch (error) {
        errors.push(`Sanity error: ${(error as Error).message}`);
      }

      // Count Supabase cars
      let supabaseCount = 0;
      let lastSync: string | undefined;
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('sanity_id, sanity_synced_at')
          .not('sanity_id', 'is', null);

        if (error) throw error;
        supabaseCount = data?.length || 0;

        // Find most recent sync
        if (data && data.length > 0) {
          const syncs = data
            .map(c => c.sanity_synced_at)
            .filter(Boolean)
            .sort()
            .reverse();
          lastSync = syncs[0];
        }
      } catch (error) {
        errors.push(`Supabase error: ${(error as Error).message}`);
      }

      setStatus({
        sanityCount,
        supabaseCount,
        lastSync,
        errors,
      });
    } catch (error) {
      toast.error('Failed to check sync status');
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncAllCars = async () => {
    setLoading(true);
    try {
      // Get all Sanity car IDs
      const sanityCars = await sanityClient.fetch<{ _id: string }[]>(
        groq`*[_type == "car"]{ _id }`
      );

      if (!sanityCars || sanityCars.length === 0) {
        toast.warning('No cars found in Sanity');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const car of sanityCars) {
        setSyncing(car._id);
        try {
          await triggerSync(car._id);
          successCount++;
        } catch (error) {
          console.error(`Error syncing car ${car._id}:`, error);
          errorCount++;
        }
      }

      setSyncing(null);
      toast.success(`Synced ${successCount} cars. ${errorCount} errors.`);
      await checkStatus();
    } catch (error) {
      setSyncing(null);
      toast.error('Failed to sync cars');
      console.error('Error syncing all cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const isInSync = status.sanityCount === status.supabaseCount && status.errors.length === 0;
  const difference = status.sanityCount - status.supabaseCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-none border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-zen text-midnight dark:text-white">
          Sanity ↔ Supabase Sync Status
        </h3>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-none hover:bg-gray-200 dark:hover:bg-gray-600 transition font-zen disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-none border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sanity Cars</div>
          <div className="text-2xl font-zen text-midnight dark:text-white">
            {loading ? '...' : status.sanityCount}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-none border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Supabase Cars</div>
          <div className="text-2xl font-zen text-midnight dark:text-white">
            {loading ? '...' : status.supabaseCount}
          </div>
        </div>

        <div className={`p-4 rounded-none border ${
          isInSync
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center mb-1">
            {isInSync ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
          </div>
          <div className={`text-lg font-zen ${
            isInSync
              ? 'text-green-600 dark:text-green-400'
              : 'text-yellow-600 dark:text-yellow-400'
          }`}>
            {isInSync ? 'In Sync' : `${Math.abs(difference)} Missing`}
          </div>
        </div>
      </div>

      {/* Last Sync */}
      {status.lastSync && (
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Last sync: {new Date(status.lastSync).toLocaleString()}
        </div>
      )}

      {/* Errors */}
      {status.errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-none">
          <div className="flex items-center mb-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h4 className="font-zen text-red-600 dark:text-red-400">Errors</h4>
          </div>
          <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
            {status.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={syncAllCars}
          disabled={loading || syncing !== null}
          className="inline-flex items-center justify-center px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen disabled:opacity-50"
        >
          {syncing ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Sync All Cars
            </>
          )}
        </button>

        <a
          href="https://www.sanity.io/manage/p/uye9uitb/api/webhooks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-midnight dark:bg-gray-700 text-white rounded-none hover:bg-gray-900 dark:hover:bg-gray-600 transition font-zen"
        >
          Check Webhook Config
        </a>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-none">
        <h4 className="font-zen text-blue-900 dark:text-blue-100 mb-2">Troubleshooting</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Make sure cars are <strong>published</strong> in Sanity (not drafts)</li>
          <li>• Verify webhook is active in Sanity Manage → API → Webhooks</li>
          <li>• Check Edge Function logs in Supabase Dashboard</li>
          <li>• Use "Sync All Cars" to manually sync if webhook isn't working</li>
        </ul>
      </div>
    </div>
  );
};


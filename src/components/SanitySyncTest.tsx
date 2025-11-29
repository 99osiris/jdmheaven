import { useState } from 'react';
import { syncCarFromSanity, syncAllCarsFromSanity } from '@/lib/sync';
import { cms } from '@/lib/cms';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/Toast';

export function SanitySyncTest() {
  const [loading, setLoading] = useState(false);
  const [sanityCars, setSanityCars] = useState<any[]>([]);
  const [supabaseCars, setSupabaseCars] = useState<any[]>([]);
  const [selectedCarId, setSelectedCarId] = useState('');

  const fetchSanityCars = async () => {
    try {
      setLoading(true);
      const result = await cms.getCars(50, 0);
      setSanityCars(result.cars || []);
      toast.success(`Found ${result.cars?.length || 0} cars in Sanity`);
    } catch (error: any) {
      console.error('Error fetching Sanity cars:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupabaseCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSupabaseCars(data || []);
      toast.success(`Found ${data?.length || 0} cars in Supabase`);
    } catch (error: any) {
      console.error('Error fetching Supabase cars:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const syncSingleCar = async () => {
    if (!selectedCarId) {
      toast.error('Please select a car to sync');
      return;
    }

    try {
      setLoading(true);
      const result = await syncCarFromSanity(selectedCarId);
      toast.success(`Successfully synced car: ${result.carId}`);
      await fetchSupabaseCars(); // Refresh list
    } catch (error: any) {
      console.error('Error syncing car:', error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const syncAllCars = async () => {
    try {
      setLoading(true);
      const results = await syncAllCarsFromSanity();
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      toast.success(`Synced ${successCount} cars${failCount > 0 ? `, ${failCount} failed` : ''}`);
      await fetchSupabaseCars(); // Refresh list
    } catch (error: any) {
      console.error('Error syncing all cars:', error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sanity ↔ Supabase Sync Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={fetchSanityCars}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Sanity Cars'}
        </button>

        <button
          onClick={fetchSupabaseCars}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Supabase Cars'}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sanity Cars ({sanityCars.length})</h3>
        <div className="border rounded p-4 max-h-60 overflow-y-auto">
          {sanityCars.length === 0 ? (
            <p className="text-gray-500">No cars found. Click "Fetch Sanity Cars" to load.</p>
          ) : (
            <div className="space-y-2">
              {sanityCars.map((car) => (
                <div
                  key={car._id}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedCarId === car._id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCarId(car._id)}
                >
                  <div className="font-medium">{car.title || `${car.brand} ${car.model}`}</div>
                  <div className="text-sm text-gray-600">ID: {car._id}</div>
                  <div className="text-sm text-gray-600">
                    {car.brand} {car.model} {car.year}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Supabase Cars ({supabaseCars.length})</h3>
        <div className="border rounded p-4 max-h-60 overflow-y-auto">
          {supabaseCars.length === 0 ? (
            <p className="text-gray-500">No cars found. Click "Fetch Supabase Cars" to load.</p>
          ) : (
            <div className="space-y-2">
              {supabaseCars.map((car) => (
                <div key={car.id} className="p-2 border rounded">
                  <div className="font-medium">{car.reference_number}</div>
                  <div className="text-sm text-gray-600">
                    {car.make} {car.model} {car.year}
                  </div>
                  <div className="text-xs text-gray-500">
                    Sanity ID: {car.sanity_id || 'Not synced'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={syncSingleCar}
          disabled={loading || !selectedCarId}
          className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync Selected Car'}
        </button>

        <button
          onClick={syncAllCars}
          disabled={loading || sanityCars.length === 0}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync All Cars'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
        <h4 className="font-semibold mb-2">Debugging Tips:</h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Make sure you have cars in Sanity Studio</li>
          <li>Check browser console for errors</li>
          <li>Verify environment variables are set correctly</li>
          <li>If sync fails, check the error message above</li>
        </ul>
      </div>
    </div>
  );
}


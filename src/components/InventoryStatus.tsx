import React from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import { inventoryApi } from '../lib/api/inventory';
import { toast } from './Toast';

interface InventoryStatusProps {
  carId: string;
}

interface HistoryEntry {
  id: string;
  status: string;
  location: { name: string };
  created_at: string;
  created_by: { full_name: string };
  notes?: string;
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ carId }) => {
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await inventoryApi.getInventoryHistory(carId);
        setHistory(data);
      } catch (error) {
        console.error('Error loading inventory history:', error);
        toast.error('Failed to load inventory history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // Subscribe to real-time updates
    const subscription = inventoryApi.subscribeToInventoryChanges(carId, () => {
      loadHistory();
    });

    return () => {
      inventoryApi.unsubscribeFromInventoryChanges(carId);
    };
  }, [carId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-none mb-4"></div>
        <div className="h-20 bg-gray-200 rounded-none"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-none p-6">
      <h3 className="text-xl font-zen text-midnight mb-6 flex items-center">
        <Package className="w-6 h-6 text-racing-red mr-2" />
        Inventory Status
      </h3>

      <div className="space-y-6">
        {history.map((entry) => (
          <div key={entry.id} className="border-l-4 border-racing-red pl-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-900">{entry.location.name}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm">
                {entry.status}
              </span>
            </div>
            {entry.notes && (
              <p className="mt-2 text-gray-600">{entry.notes}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Updated by {entry.created_by.full_name}
            </p>
          </div>
        ))}

        {history.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No inventory history available
          </p>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { vinApi } from '../lib/api/vin';
import type { VehicleHistory } from '../lib/api/vin';

interface VehicleTrackerProps {
  vin: string;
}

const statusColors = {
  in_transit: 'bg-blue-500',
  customs: 'bg-yellow-500',
  delivered: 'bg-green-500',
  processing: 'bg-purple-500'
};

const statusLabels = {
  in_transit: 'In Transit',
  customs: 'Customs Processing',
  delivered: 'Delivered',
  processing: 'Processing'
};

export const VehicleTracker: React.FC<VehicleTrackerProps> = ({ vin }) => {
  const [history, setHistory] = useState<VehicleHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await vinApi.getVehicleHistory(vin);
        setHistory(data);
      } catch (err) {
        console.error('Error loading vehicle history:', err);
        setError('Failed to load vehicle history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [vin]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading vehicle history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const currentStatus = history[0]?.status || 'processing';

  return (
    <div className="bg-white shadow-lg rounded-none p-6">
      <div className="mb-8">
        <h3 className="text-xl font-zen text-midnight mb-4">Current Status</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${statusColors[currentStatus]} mr-2`}></div>
          <span className="font-zen">{statusLabels[currentStatus]}</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-8">
          {history.map((event, index) => (
            <div key={event.id} className="relative pl-8">
              <div className={`absolute left-3 w-3 h-3 -translate-x-1/2 rounded-full ${
                index === 0 ? statusColors[event.status] : 'bg-gray-400'
              } border-2 border-white`}></div>
              
              <div className="bg-gray-50 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-zen text-midnight">{event.event}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(event.timestamp).toLocaleDateString()}
                  </div>
                </div>
                {event.details && (
                  <p className="text-sm text-gray-600 mt-2">{event.details}</p>
                )}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
                    statusColors[event.status]
                  } text-white rounded-full`}>
                    {statusLabels[event.status]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {history.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tracking history available yet</p>
        </div>
      )}
    </div>
  );
};
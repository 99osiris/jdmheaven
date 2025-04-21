import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { inventoryApi } from '../../lib/api/inventory';
import { toast } from '../../components/Toast';

interface StockAlert {
  id: string;
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_max?: number;
  created_at: string;
  is_active: boolean;
}

export const AlertsWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await inventoryApi.getStockAlerts();
        setAlerts(data.slice(0, 3)); // Show only 3 items in widget
      } catch (error) {
        console.error('Error loading alerts:', error);
        toast.error('Failed to load stock alerts');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-6">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No stock alerts set</p>
        <Link to="/dashboard/alerts" className="text-racing-red hover:text-red-700 text-sm mt-2 inline-block">
          Create an alert
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="p-3 border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-zen text-sm">
              {alert.make} {alert.model}
            </h4>
            <span className={`w-3 h-3 rounded-full ${alert.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {alert.year_min && alert.year_max && `${alert.year_min} - ${alert.year_max}`}
            {alert.price_max && ` • Up to €${alert.price_max.toLocaleString()}`}
          </p>
        </div>
      ))}
      
      <div className="pt-2">
        <Link
          to="/dashboard/alerts"
          className="flex items-center text-racing-red hover:text-red-700 text-sm"
        >
          Manage alerts
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
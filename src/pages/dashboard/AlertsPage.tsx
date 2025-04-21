import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SEO } from '../../components/SEO';
import { inventoryApi } from '../../lib/api/inventory';
import { Bell, Trash2, Power } from 'lucide-react';
import { toast } from '../../components/Toast';
import { StockAlertForm } from '../../components/StockAlertForm';

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

const AlertsPage = () => {
  const [alerts, setAlerts] = React.useState<StockAlert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await inventoryApi.getStockAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error loading alerts:', error);
        toast.error('Failed to load stock alerts');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) {
      return;
    }

    try {
      await inventoryApi.deleteStockAlert(id);
      setAlerts(alerts.filter(a => a.id !== id));
      toast.success('Alert deleted');
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await inventoryApi.toggleStockAlert(id, !isActive);
      setAlerts(alerts.map(a => 
        a.id === id ? { ...a, is_active: !isActive } : a
      ));
      toast.success(`Alert ${isActive ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Failed to update alert');
    }
  };

  return (
    <>
      <SEO 
        title="Stock Alerts"
        description="Manage your stock alerts for new inventory"
      />
      
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-zen">Stock Alerts</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white p-6 shadow-sm">
                      <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
                      <div className="h-4 bg-gray-200 w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className={`w-5 h-5 mr-3 ${alert.is_active ? 'text-racing-red' : 'text-gray-400'}`} />
                          <div>
                            <h3 className="font-zen mb-1">
                              {alert.make} {alert.model}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {alert.year_min && alert.year_max && `${alert.year_min} - ${alert.year_max}`}
                              {alert.price_max && ` • Up to €${alert.price_max.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleToggle(alert.id, alert.is_active)}
                            className={`${
                              alert.is_active ? 'text-green-500' : 'text-gray-400'
                            } hover:text-gray-600 transition`}
                          >
                            <Power className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(alert.id)}
                            className="text-gray-400 hover:text-gray-600 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white shadow-sm">
                  <p className="text-gray-500">You don't have any stock alerts set up</p>
                </div>
              )}
            </div>

            <div>
              <StockAlertForm />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AlertsPage;
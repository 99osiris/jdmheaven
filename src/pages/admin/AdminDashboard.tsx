import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { ActivityLog } from '../../components/admin/ActivityLog';
import { SalesChart } from '../../components/admin/SalesChart';
import { QuickActions } from '../../components/admin/QuickActions';
import { DataTable } from '../../components/admin/DataTable';
import { SearchInput } from '../../components/admin/SearchInput';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalRequests: 0,
    totalContacts: 0,
    revenueStats: {
      total: 1500000,
      thisMonth: 250000,
      lastMonth: 200000,
    },
    inventoryStats: {
      available: 0,
      pending: 0,
      sold: 0,
    },
    requestStats: {
      pending: 0,
      inProgress: 0,
      completed: 0,
    },
  });
  const [activities, setActivities] = useState([]);
  const [salesChart, setSalesChart] = useState({
    labels: [],
    values: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch counts
        const [
          { count: carsCount }, 
          { count: usersCount },
          { count: requestsCount },
          { count: contactsCount }
        ] = await Promise.all([
          supabase.from('cars').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('custom_requests').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true })
        ]);

        // Fetch inventory stats
        const { data: inventoryData } = await supabase
          .from('cars')
          .select('status');

        const inventoryStats = {
          available: inventoryData?.filter(car => car.status === 'available').length || 0,
          pending: inventoryData?.filter(car => car.status === 'pending').length || 0,
          sold: inventoryData?.filter(car => car.status === 'sold').length || 0
        };

        // Fetch request stats
        const { data: requestData } = await supabase
          .from('custom_requests')
          .select('status');

        const requestStats = {
          pending: requestData?.filter(req => req.status === 'pending').length || 0,
          inProgress: requestData?.filter(req => req.status === 'in_progress').length || 0,
          completed: requestData?.filter(req => req.status === 'completed').length || 0
        };

        // Generate last 6 months for chart
        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toLocaleString('default', { month: 'short' });
        }).reverse();

        // Generate mock sales data
        const mockSalesData = Array.from({ length: 6 }, () => 
          Math.floor(Math.random() * 10) + 5
        );

        setStats({
          totalCars: carsCount || 0,
          totalUsers: usersCount || 0,
          totalRequests: requestsCount || 0,
          totalContacts: contactsCount || 0,
          revenueStats: stats.revenueStats,
          inventoryStats,
          requestStats,
        });

        setSalesChart({
          labels: lastSixMonths,
          values: mockSalesData,
        });

        // Generate mock activities
        const mockActivities = [
          {
            id: '1',
            type: 'user',
            action: 'New User Registration',
            details: 'A new user has registered on the platform',
            timestamp: new Date().toISOString(),
            user: {
              name: 'John Doe',
              email: 'john@example.com',
            },
          },
          {
            id: '2',
            type: 'car',
            action: 'New Car Listed',
            details: 'Nissan Skyline GT-R R34 has been added to inventory',
            timestamp: new Date().toISOString(),
            user: {
              name: 'Admin User',
              email: 'admin@jdmheaven.com',
            },
          },
          {
            id: '3',
            type: 'message',
            action: 'New Contact Message',
            details: 'Inquiry about Toyota Supra RZ',
            timestamp: new Date().toISOString(),
          },
        ];

        setActivities(mockActivities);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!user?.user_metadata?.role === 'admin') {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">Unauthorized. Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-zen mb-6">Admin Dashboard</h1>
          <p className="text-xl text-gray-300">Welcome back, {user.user_metadata?.full_name || user.email}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            <DashboardStats stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SalesChart data={salesChart} />
              <ActivityLog activities={activities} />
            </div>

            <div className="bg-white shadow-lg rounded-none p-6">
              <div className="mb-6">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search activities..."
                />
              </div>

              <DataTable
                data={activities.filter(activity =>
                  activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  activity.details.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                columns={[
                  {
                    key: 'action',
                    header: 'Action',
                  },
                  {
                    key: 'details',
                    header: 'Details',
                  },
                  {
                    key: 'timestamp',
                    header: 'Date',
                    render: (value) => new Date(value as string).toLocaleString(),
                  },
                ]}
                pageSize={5}
              />
            </div>

            <QuickActions />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
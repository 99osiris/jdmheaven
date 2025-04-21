import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Car, Bell, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from '../Toast';
import type { WishlistItem, CarComparison, CustomRequest } from '../../types';
import { supabase } from '../../lib/supabase';

export const DashboardOverview = () => {
  const [data, setData] = React.useState<{
    wishlist: WishlistItem[];
    comparisons: CarComparison[];
    customRequests: CustomRequest[];
  }>({
    wishlist: [],
    comparisons: [],
    customRequests: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Check Supabase connection first
        const { error: authError } = await supabase.auth.getSession();
        if (authError) {
          throw new Error('Authentication error: Please sign in again');
        }

        const [wishlistData, comparisonsData, requestsData] = await Promise.all([
          api.wishlist.getAll().catch(err => {
            console.error('Wishlist fetch error:', err);
            throw new Error('Failed to load wishlist');
          }),
          api.comparisons.getAll().catch(err => {
            console.error('Comparisons fetch error:', err);
            throw new Error('Failed to load comparisons');
          }),
          api.customRequests.getAll().catch(err => {
            console.error('Custom requests fetch error:', err);
            throw new Error('Failed to load custom requests');
          }),
        ]);

        setData({
          wishlist: wishlistData,
          comparisons: comparisonsData,
          customRequests: requestsData,
        });
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        console.error('Error loading dashboard data:', err);
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-40 bg-gray-200 rounded-sm"></div>
        <div className="h-40 bg-gray-200 rounded-sm"></div>
        <div className="h-40 bg-gray-200 rounded-sm"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 p-4 rounded-lg inline-block">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-red-700 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Saved Cars</p>
              <h3 className="text-2xl font-zen">{data.wishlist.length}</h3>
            </div>
            <Heart className="w-8 h-8 text-racing-red" />
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Comparisons</p>
              <h3 className="text-2xl font-zen">{data.comparisons.length}</h3>
            </div>
            <Car className="w-8 h-8 text-racing-red" />
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Custom Requests</p>
              <h3 className="text-2xl font-zen">{data.customRequests.length}</h3>
            </div>
            <Bell className="w-8 h-8 text-racing-red" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-sm p-6">
        <h2 className="text-xl font-zen mb-6">Recent Activity</h2>
        
        <div className="space-y-6">
          {data.wishlist.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <Heart className="w-5 h-5 text-racing-red flex-shrink-0" />
              <div>
                <p className="text-gray-900">Added to Wishlist</p>
                <p className="text-sm text-gray-500">
                  {item.car.year} {item.car.make} {item.car.model}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {data.customRequests.slice(0, 3).map((request) => (
            <div key={request.id} className="flex items-start space-x-4">
              <Clock className="w-5 h-5 text-racing-red flex-shrink-0" />
              <div>
                <p className="text-gray-900">Custom Request</p>
                <p className="text-sm text-gray-500">
                  {request.make} {request.model} • Status: {request.status}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {data.wishlist.length === 0 && data.customRequests.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/inventory"
          className="bg-white p-6 shadow-sm hover:shadow-md transition group"
        >
          <Car className="w-8 h-8 text-racing-red mb-4" />
          <h3 className="text-xl font-zen mb-2">Browse Inventory</h3>
          <p className="text-gray-600">
            Explore our collection of premium JDM cars
          </p>
        </Link>

        <Link
          to="/custom-request"
          className="bg-white p-6 shadow-sm hover:shadow-md transition group"
        >
          <Bell className="w-8 h-8 text-racing-red mb-4" />
          <h3 className="text-xl font-zen mb-2">Request Custom Search</h3>
          <p className="text-gray-600">
            Let us find your dream car
          </p>
        </Link>
      </div>
    </div>
  );
};
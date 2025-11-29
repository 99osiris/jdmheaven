import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SEO } from '../../components/SEO';
import { api } from '../../lib/api';
import { CarCard } from '../../components/CarCard';
import { toast } from '../../components/Toast';
import type { WishlistItem } from '../../types';

const WishlistPage = () => {
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await api.wishlist.getAll();
        setWishlist(data);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  return (
    <>
      <SEO 
        title="My Wishlist"
        description="View and manage your saved cars"
      />
      
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-zen">My Wishlist</h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 mb-4"></div>
                  <div className="h-8 bg-gray-200 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {wishlist.map((item) => {
                const car = typeof item.car === 'object' && item.car ? item.car : null;
                if (!car) return null;
                return <CarCard key={item.id} car={car} />;
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white shadow-sm">
              <p className="text-gray-500 mb-4">Your wishlist is empty</p>
              <a 
                href="/inventory" 
                className="text-racing-red hover:text-red-700 transition"
              >
                Browse our inventory
              </a>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default WishlistPage;
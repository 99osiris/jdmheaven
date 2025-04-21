import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/Toast';
import { Heart, ArrowRight } from 'lucide-react';
import type { WishlistItem } from '../../types';

export const WishlistWidget: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await api.wishlist.getAll();
        setWishlist(data.slice(0, 3)); // Show only 3 items in widget
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-16 h-12 bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-6">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Your wishlist is empty</p>
        <Link to="/inventory" className="text-racing-red hover:text-red-700 text-sm mt-2 inline-block">
          Browse inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wishlist.map((item) => (
        <div key={item.id} className="flex items-center space-x-4">
          <div className="w-16 h-12 bg-gray-100 flex-shrink-0">
            {item.car.images && item.car.images[0] && (
              <img
                src={item.car.images[0].url}
                alt={`${item.car.make} ${item.car.model}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-zen text-sm">
              {item.car.make} {item.car.model}
            </h4>
            <p className="text-sm text-gray-500">
              {item.car.year} • €{item.car.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      
      <div className="pt-2">
        <Link
          to="/dashboard/wishlist"
          className="flex items-center text-racing-red hover:text-red-700 text-sm"
        >
          View all saved cars
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
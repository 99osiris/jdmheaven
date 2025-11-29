import React from 'react';
import { Link } from 'react-router-dom';
import { CarCard } from './CarCard';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { Card } from './ui/Card';
import { ArrowRight } from 'lucide-react';

export const RecentlyViewed: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-zen font-bold">Recently Viewed</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-text-secondary hover:text-text-primary transition-fast"
          >
            Clear
          </button>
          <Link
            to="/inventory"
            className="text-sm text-racing-red hover:text-racing-red-light transition-fast flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentlyViewed.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
};


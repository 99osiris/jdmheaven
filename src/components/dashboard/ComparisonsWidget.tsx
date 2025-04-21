import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/Toast';
import { Car, ArrowRight } from 'lucide-react';
import type { CarComparison } from '../../types';

export const ComparisonsWidget: React.FC = () => {
  const [comparisons, setComparisons] = useState<CarComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComparisons = async () => {
      try {
        const data = await api.comparisons.getAll();
        setComparisons(data.slice(0, 3)); // Show only 3 items in widget
      } catch (error) {
        console.error('Error loading comparisons:', error);
        toast.error('Failed to load comparisons');
      } finally {
        setLoading(false);
      }
    };

    loadComparisons();
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

  if (comparisons.length === 0) {
    return (
      <div className="text-center py-6">
        <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No comparisons yet</p>
        <Link to="/inventory" className="text-racing-red hover:text-red-700 text-sm mt-2 inline-block">
          Compare cars
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comparisons.map((comparison) => (
        <Link
          key={comparison.id}
          to={`/comparison/${comparison.id}`}
          className="block p-3 border border-gray-100 hover:border-racing-red hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-zen text-sm">{comparison.name}</h4>
            <span className="text-xs text-gray-500">
              {comparison.cars.length} cars
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Created {new Date(comparison.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
      
      <div className="pt-2">
        <Link
          to="/dashboard/comparisons"
          className="flex items-center text-racing-red hover:text-red-700 text-sm"
        >
          View all comparisons
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
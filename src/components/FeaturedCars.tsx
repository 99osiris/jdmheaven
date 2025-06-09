import React, { useEffect, useState } from 'react';
import { Car, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import type { Car as CarType } from '../types';
import { toast } from './Toast';

const CarSkeleton = () => (
  <div className="bg-midnight animate-pulse">
    <div className="h-48 bg-gray-800" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-800 rounded w-3/4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-800 rounded w-1/4" />
        <div className="h-4 bg-gray-800 rounded w-1/4" />
      </div>
      <div className="h-4 bg-gray-800 rounded w-2/3" />
      <div className="h-12 bg-gray-800 rounded" />
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-12">
    <AlertTriangle className="w-12 h-12 text-racing-red mx-auto mb-4" />
    <h3 className="text-xl font-zen text-white mb-4">Failed to load featured cars</h3>
    <p className="text-gray-400 mb-6">There was an error loading the featured cars. Please try again.</p>
    <button
      onClick={onRetry}
      className="bg-racing-red text-white px-6 py-3 rounded-none hover:bg-red-700 transition font-zen"
    >
      Try Again
    </button>
  </div>
);

const FeaturedCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const allCars = await api.cars.getAll();
      // Get 3 random cars for featured section
      const randomCars = allCars
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setCars(randomCars);
    } catch (err) {
      console.error('Error loading featured cars:', err);
      setError(err instanceof Error ? err : new Error('Failed to load cars'));
      toast.error('Failed to load featured cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <section id="inventory" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-zen text-midnight mb-4">Featured JDM Legends</h2>
          <p className="text-lg text-gray-600">Discover our handpicked selection of iconic Japanese performance cars</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <CarSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={loadCars} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-midnight text-white rounded-none overflow-hidden transform hover:scale-105 transition duration-300"
                >
                  <div className="relative h-48 group">
                    <img
                      src={car.images?.[0]?.url}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/car-placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-zen mb-2">{car.make} {car.model}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">{car.year}</span>
                      <span className="text-racing-red font-zen">€{car.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 mb-4">{car.engine_type}, {car.horsepower}HP</p>
                    <button 
                      onClick={() => navigate(`/inventory?car=${car.reference_number}`)}
                      className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/inventory"
                className="inline-flex items-center px-8 py-4 bg-midnight text-white rounded-none hover:bg-gray-900 transition font-zen"
              >
                View Full Inventory
                <Car className="ml-2" size={20} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
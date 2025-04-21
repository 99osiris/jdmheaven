import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import type { Car as CarType } from '../types';

const FeaturedCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const allCars = await api.cars.getAll();
        // Get 3 random cars for featured section
        const randomCars = allCars
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setCars(randomCars);
      } catch (err) {
        console.error('Error loading featured cars:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured cars...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inventory" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-zen text-midnight mb-4">Featured JDM Legends</h2>
          <p className="text-lg text-gray-600">Discover our handpicked selection of iconic Japanese performance cars</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car.id} className="bg-midnight text-white rounded-none overflow-hidden transform hover:scale-105 transition duration-300">
              <div className="relative h-48">
                <img
                  src={car.images?.[0]?.url}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
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
      </div>
    </section>
  );
};

export default FeaturedCars;
import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cms } from '../../lib/cms';
import { SanityImage } from '../SanityImage';

interface FeaturedCar {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
  specs: string[];
  referenceId: string;
}

export const FeaturedCarsFromCMS: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<FeaturedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await cms.getFeaturedCars();
        setCars(data);
      } catch (err) {
        setError('Failed to load featured cars');
        console.error(err);
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

  if (error || cars.length === 0) {
    // Fallback to database cars if CMS fails
    return null;
  }

  return (
    <section id="inventory" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-zen text-midnight mb-4">Featured JDM Legends</h2>
          <p className="text-lg text-gray-600">Discover our handpicked selection of iconic Japanese performance cars</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-midnight text-white rounded-none overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <div className="relative h-48">
                <SanityImage
                  image={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                  priority={index === 0}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-zen mb-2">{car.make} {car.model}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">{car.year}</span>
                  <span className="text-racing-red font-zen">€{car.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-400 mb-4 line-clamp-2">{car.description}</p>
                <button 
                  onClick={() => navigate(`/inventory?car=${car.referenceId}`)}
                  className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition"
                >
                  View Details
                </button>
              </div>
            </motion.div>
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

export default FeaturedCarsFromCMS;
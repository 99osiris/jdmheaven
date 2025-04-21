import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import type { Car, CarComparison } from '../types';
import BackButton from '../components/BackButton';

const ComparisonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState<CarComparison | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComparison = async () => {
      try {
        if (!id) return;
        
        const comparisons = await api.comparisons.getAll();
        const currentComparison = comparisons.find(c => c.id === id);
        
        if (!currentComparison) {
          setError('Comparison not found');
          return;
        }

        setComparison(currentComparison);

        // Fetch all cars in the comparison
        const carData = await Promise.all(
          currentComparison.cars.map(carId => api.cars.getById(carId))
        );

        setCars(carData);
      } catch (err) {
        console.error('Error loading comparison:', err);
        setError('Failed to load comparison');
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [id]);

  const handleDelete = async () => {
    if (!comparison) return;

    if (window.confirm('Are you sure you want to delete this comparison?')) {
      try {
        await api.comparisons.delete(comparison.id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting comparison:', err);
        alert('Failed to delete comparison');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error || 'Comparison not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-racing-red text-white px-6 py-2 font-zen"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Make', key: 'make' },
    { label: 'Model', key: 'model' },
    { label: 'Year', key: 'year' },
    { label: 'Price', key: 'price', format: (value: number) => `€${value.toLocaleString()}` },
    { label: 'Mileage', key: 'mileage', format: (value: number) => `${value.toLocaleString()} km` },
    { label: 'Engine Type', key: 'engine_type' },
    { label: 'Engine Size', key: 'engine_size' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Drivetrain', key: 'drivetrain' },
    { label: 'Horsepower', key: 'horsepower', format: (value: number) => `${value} HP` },
    { label: 'Torque', key: 'torque' },
    { label: 'Color', key: 'color' },
    { label: 'Location', key: 'location' },
  ];

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BackButton className="mr-4" />
              <h1 className="text-4xl font-zen">{comparison.name}</h1>
            </div>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
            >
              <Trash2 size={20} className="mr-2" />
              Delete Comparison
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car.id} className="bg-midnight text-white">
              <div className="relative h-48">
                <img
                  src={car.images?.[0]?.url}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-racing-red px-3 py-1 text-sm font-zen">
                  {car.status}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-zen mb-4">{car.make} {car.model}</h3>
                <div className="space-y-4">
                  {specs.map((spec) => (
                    <div key={spec.key} className="border-b border-gray-700 pb-2">
                      <span className="text-gray-400">{spec.label}:</span>
                      <span className="ml-2 text-white">
                        {spec.format 
                          ? spec.format(car[spec.key as keyof Car] as number)
                          : car[spec.key as keyof Car] || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/contact?car=${car.reference_number}`)}
                  className="w-full mt-6 bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
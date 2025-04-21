import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Car } from '../types';

interface CompareDrawerProps {
  cars: Car[];
  onRemove: (car: Car) => void;
  onClose: () => void;
  onSave: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  cars,
  onRemove,
  onClose,
  onSave,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (cars.length === 0) return null;

  const handleSave = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    onSave();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-midnight border-t border-gray-800 p-4 transform transition-transform z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-zen text-white">
            Compare Cars ({cars.length}/3)
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition"
          >
            <X />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-black/30 p-4 relative">
              <button
                onClick={() => onRemove(car)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
              <div className="relative h-24 mb-3">
                <img
                  src={car.images?.[0]?.url}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-zen text-white mb-1 truncate">
                {car.make} {car.model}
              </h4>
              <p className="text-sm text-gray-400">
                {car.year} • {car.engine_type}
              </p>
            </div>
          ))}
          {Array.from({ length: 3 - cars.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="bg-black/30 p-4 flex items-center justify-center text-gray-600 border border-dashed border-gray-700"
            >
              Add a car
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            {cars.length < 2 
              ? 'Select at least 2 cars to compare'
              : 'Ready to compare selected cars'}
          </p>
          <button
            onClick={handleSave}
            disabled={cars.length < 2}
            className="bg-racing-red text-white px-6 py-2 font-zen disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Heart, Share2, Info, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAccount } from '../contexts/AccountContext';
import type { Car } from '../types';

interface CarCardProps {
  car: Car;
  onAddToCompare?: (car: Car) => void;
  isInCompare?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onAddToCompare, isInCompare }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, addToCart } = useAccount();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(car);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(car, 'general');
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCompare?.(car);
  };

  const handleInquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/contact?car=${car.reference_number}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: `${car.make} ${car.model}`,
      text: `Check out this ${car.year} ${car.make} ${car.model} on JDM HEAVEN!`,
      url: `${window.location.origin}/inventory?car=${car.reference_number}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const mainImage = car.images?.find(img => img.is_primary)?.url || car.images?.[0]?.url;

  return (
    <div 
      className="bg-midnight text-white rounded-none overflow-hidden group transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img 
          src={mainImage} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-racing-red px-3 py-1 text-sm font-zen">
          {car.status}
        </div>
        <div className="absolute top-4 left-4 flex space-x-2">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full backdrop-blur-md ${
              isInWishlist(car.id) ? 'bg-racing-red' : 'bg-black/50 hover:bg-racing-red'
            } transition`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(car.id) ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-black/50 hover:bg-racing-red backdrop-blur-md transition"
            title="Add to inquiries"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-black/50 hover:bg-racing-red backdrop-blur-md transition"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => navigate(`/inventory/${car.reference_number}`)}
              className="bg-racing-red text-white py-2 px-4 flex items-center space-x-2 hover:bg-red-700 transition"
            >
              <Info className="w-4 h-4" />
              <span>View Details</span>
            </button>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-zen mb-1">{car.make} {car.model}</h3>
            <p className="text-gray-400">{car.year} • {car.mileage?.toLocaleString()} km</p>
          </div>
          <span className="text-racing-red font-zen text-xl">
            €{car.price.toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-400">Engine:</span>
            <span className="ml-2 text-white">{car.engine_type}</span>
          </div>
          <div>
            <span className="text-gray-400">Power:</span>
            <span className="ml-2 text-white">{car.horsepower} HP</span>
          </div>
          <div>
            <span className="text-gray-400">Transmission:</span>
            <span className="ml-2 text-white">{car.transmission}</span>
          </div>
          <div>
            <span className="text-gray-400">Location:</span>
            <span className="ml-2 text-white">{car.location}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCompare}
            className={`py-3 font-zen transition ${
              isInCompare
                ? 'bg-gray-700 text-gray-300'
                : 'bg-midnight text-white hover:bg-gray-800'
            } border border-gray-700`}
          >
            {isInCompare ? 'In Compare' : 'Compare'}
          </button>
          <button
            onClick={handleInquire}
            className="bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition"
          >
            Inquire Now
          </button>
        </div>
      </div>
    </div>
  );
};
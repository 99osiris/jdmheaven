import React from 'react';
import { Heart, Share2, Info, ShoppingCart, MapPin, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAccount } from '../contexts/AccountContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { analytics } from '../lib/analytics';
import type { Car } from '../types';

interface CarCardProps {
  car: Car;
  onAddToCompare?: (car: Car) => void;
  isInCompare?: boolean;
  onQuickView?: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onAddToCompare, isInCompare, onQuickView }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, addToCart } = useAccount();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Check if car is new (added in last 7 days)
  const isNew = car.created_at 
    ? new Date(car.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    : false;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasInWishlist = isInWishlist(car.id);
    await toggleWishlist(car);
    analytics.carWishlist(car.id, wasInWishlist ? 'remove' : 'add');
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(car, 'general');
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasInCompare = isInCompare || false;
    onAddToCompare?.(car);
    analytics.carCompare(car.id, wasInCompare ? 'remove' : 'add');
  };

  const handleInquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    analytics.carInquiry(car.id, `${car.make} ${car.model}`, 'general');
    navigate(`/contact?car=${car.reference_number}`);
  };

  const handleCardClick = () => {
    addToRecentlyViewed(car);
    analytics.carView(car.id, `${car.make} ${car.model}`, car.price);
    navigate(`/inventory/${car.reference_number}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

      const shareData = {
      title: `${car.make} ${car.model} ${car.year}`,
      text: `Check out this ${car.year} ${car.make} ${car.model} for €${car.price.toLocaleString()} on JDM HEAVEN!`,
      url: `${window.location.origin}/inventory/${car.reference_number}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        analytics.carShare(car.id, 'native_share');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        analytics.carShare(car.id, 'clipboard');
        // Show toast instead of alert
        const event = new CustomEvent('toast', {
          detail: { message: 'Link copied to clipboard!', type: 'success' }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const mainImage = car.images?.find(img => img.is_primary)?.url || car.images?.[0]?.url;

  return (
    <div 
      className="bg-midnight text-white rounded-none overflow-hidden group transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative h-64">
        <img 
          src={mainImage} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isNew && (
            <div className="bg-success px-3 py-1 text-sm font-zen flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              New Arrival
            </div>
          )}
          <div className={`px-3 py-1 text-sm font-zen ${
            car.status === 'available' ? 'bg-racing-red' :
            car.status === 'in_transit' ? 'bg-warning' :
            car.status === 'reserved' ? 'bg-info' :
            'bg-charcoal'
          }`}>
            {(car.status?.replace(/_/g, ' ') || 'AVAILABLE').toUpperCase()}
          </div>
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
          <div className="flex-1">
            <h3 className="text-xl font-zen mb-1">{car.make} {car.model}</h3>
            <div className="flex items-center gap-3 text-sm text-text-secondary mb-2">
              <span>{car.year}</span>
              {car.mileage && <span>• {car.mileage.toLocaleString()} km</span>}
              {car.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {car.location}
                </span>
              )}
            </div>
            {/* Quick Specs */}
            <div className="flex flex-wrap gap-2 text-xs text-text-tertiary">
              {car.horsepower && <span>{car.horsepower} HP</span>}
              {car.transmission && <span>• {car.transmission}</span>}
              {car.drivetrain && <span>• {car.drivetrain}</span>}
            </div>
          </div>
          <div className="text-right ml-4">
            <span className="text-racing-red font-zen text-xl block">
              €{car.price.toLocaleString()}
            </span>
            <span className="text-xs text-text-tertiary">Import costs not included</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-text-secondary">Engine:</span>
            <span className="ml-2 text-text-primary">{car.engine_type}</span>
          </div>
          <div>
            <span className="text-text-secondary">Power:</span>
            <span className="ml-2 text-text-primary">{car.horsepower} HP</span>
          </div>
          <div>
            <span className="text-text-secondary">Transmission:</span>
            <span className="ml-2 text-text-primary">{car.transmission_type || 'N/A'}</span>
          </div>
          <div>
            <span className="text-text-secondary">Location:</span>
            <span className="ml-2 text-text-primary">{car.location || 'Japan'}</span>
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
import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, ShoppingCart, Compare, MapPin, Calendar, Gauge, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../contexts/AccountContext';
import { analytics } from '../lib/analytics';
import { Button } from './ui/Button';
import type { Car } from '../types';

interface QuickViewModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ car, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, addToCart } = useAccount();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && car) {
      setSelectedImageIndex(0);
      document.body.style.overflow = 'hidden';
      analytics.carView(car.id, `${car.make} ${car.model}`, car.price);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, car]);

  if (!isOpen || !car) return null;

  const mainImage = car.images?.find((img: any) => img.is_primary)?.url || car.images?.[0]?.url || '/placeholder-car.jpg';
  const allImages = car.images?.map((img: any) => img.url) || [mainImage];

  const handleWishlist = async () => {
    const wasInWishlist = isInWishlist(car.id);
    await toggleWishlist(car);
    analytics.carWishlist(car.id, wasInWishlist ? 'remove' : 'add');
  };

  const handleAddToCart = async () => {
    await addToCart(car, 'general');
    analytics.carInquiry(car.id, `${car.make} ${car.model}`, 'general');
  };

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/inventory/${car.reference_number}`);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/inventory/${car.reference_number}`;
    const shareText = `Check out this ${car.year} ${car.make} ${car.model} for €${car.price.toLocaleString()} on JDM HEAVEN!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${car.make} ${car.model}`,
          text: shareText,
          url: shareUrl,
        });
        analytics.carShare(car.id, 'native_share');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        analytics.carShare(car.id, 'clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-midnight border border-charcoal max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-midnight border-b border-charcoal p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-zen font-bold">{car.make} {car.model}</h2>
            <p className="text-racing-red font-zen text-lg">€{car.price.toLocaleString()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative aspect-video bg-charcoal group">
              <img
                src={allImages[selectedImageIndex] || mainImage}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-racing-red transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-racing-red transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`h-1 flex-1 transition ${
                      selectedImageIndex === idx ? 'bg-racing-red' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {allImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-video bg-charcoal border-2 transition ${
                      selectedImageIndex === idx
                        ? 'border-racing-red'
                        : 'border-transparent hover:border-charcoal'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{car.year}</span>
              </div>
              {car.mileage && (
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  <span>{car.mileage.toLocaleString()} km</span>
                </div>
              )}
              {car.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{car.location}</span>
                </div>
              )}
              {car.horsepower && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>{car.horsepower} HP</span>
                </div>
              )}
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Engine:</span>
                <p className="text-text-primary font-medium">{car.engine_type}</p>
              </div>
              <div>
                <span className="text-text-secondary">Power:</span>
                <p className="text-text-primary font-medium">{car.horsepower} HP</p>
              </div>
              <div>
                <span className="text-text-secondary">Transmission:</span>
                <p className="text-text-primary font-medium">{car.transmission_type || 'N/A'}</p>
              </div>
              <div>
                <span className="text-text-secondary">Drivetrain:</span>
                <p className="text-text-primary font-medium">{car.drivetrain_type || 'N/A'}</p>
              </div>
            </div>

            {/* Description Preview */}
            {car.description && (
              <div>
                <h3 className="font-zen text-lg mb-2">Description</h3>
                <p className="text-text-secondary text-sm line-clamp-3">
                  {car.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-charcoal">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleViewFullDetails}
                  variant="primary"
                  fullWidth
                  glow
                >
                  View Full Details
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  fullWidth
                >
                  <ShoppingCart className="w-4 h-4" />
                  Inquire
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleWishlist}
                  variant={isInWishlist(car.id) ? 'primary' : 'ghost'}
                  fullWidth
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(car.id) ? 'fill-white' : ''}`} />
                  {isInWishlist(car.id) ? 'Saved' : 'Save'}
                </Button>
                <Button
                  onClick={() => navigate(`/comparison?add=${car.id}`)}
                  variant="ghost"
                  fullWidth
                >
                  <Compare className="w-4 h-4" />
                  Compare
                </Button>
                <Button
                  onClick={handleShare}
                  variant="ghost"
                  fullWidth
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


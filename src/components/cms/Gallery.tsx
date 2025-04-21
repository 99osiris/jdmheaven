import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, RefreshCw } from 'lucide-react';
import { cms } from '../../lib/cms';
import { SanityImage } from '../SanityImage';

interface GalleryProps {
  category?: string;
  columns?: 2 | 3 | 4;
  limit?: number;
}

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export const Gallery: React.FC<GalleryProps> = ({
  category,
  columns = 3,
  limit = 12,
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const data = await cms.getGallery(category);
          if (data && data.length > 0) {
            setImages(data.slice(0, limit));
          } else {
            // If we get empty data, use fallback
            throw new Error('No gallery images available');
          }
        } catch (err: any) {
          console.error('Gallery loading error:', err);
          setError({
            message: err.error || 'Failed to load gallery',
            details: err.details
          });
          
          // Use fallback data
          setImages(getFallbackImages().slice(0, limit));
        }
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [category, limit, retryCount]);

  const getFallbackImages = (): GalleryImage[] => {
    return [
      {
        _id: '1',
        title: 'Nissan Skyline GT-R R34',
        description: 'The legendary Godzilla in Bayside Blue',
        imageUrl: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80',
        category: 'cars'
      },
      {
        _id: '2',
        title: 'Toyota Supra MK4',
        description: 'Iconic 2JZ-powered sports car',
        imageUrl: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80',
        category: 'cars'
      },
      {
        _id: '3',
        title: 'Mazda RX-7 FD',
        description: 'Rotary-powered beauty',
        imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80',
        category: 'cars'
      },
      {
        _id: '4',
        title: 'Honda NSX',
        description: 'The everyday supercar',
        imageUrl: 'https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&q=80',
        category: 'cars'
      },
      {
        _id: '5',
        title: 'Tokyo Auto Salon',
        description: 'Japan\'s premier automotive event',
        imageUrl: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80',
        category: 'events'
      },
      {
        _id: '6',
        title: 'JDM HEAVEN Showroom',
        description: 'Our Rotterdam facility',
        imageUrl: 'https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&q=80',
        category: 'showroom'
      }
    ];
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 mb-2"></div>
            <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0 && error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error.message}</div>
        {error.details && process.env.NODE_ENV === 'development' && (
          <div className="text-sm text-gray-500 mb-4">{error.details}</div>
        )}
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return <div className="text-gray-500">No images found</div>;
  }

  return (
    <>
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error.message} - Showing fallback content.
              </p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm text-racing-red hover:text-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {images.map((image) => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group cursor-pointer"
            onClick={() => openLightbox(image)}
          >
            <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-gray-100">
              <SanityImage
                image={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white w-10 h-10" />
              </div>
            </div>
            <h3 className="mt-2 text-lg font-zen">{image.title}</h3>
            {image.description && (
              <p className="text-sm text-gray-600">{image.description}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-racing-red transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <SanityImage
                image={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="mt-4 text-white">
                <h3 className="text-xl font-zen">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
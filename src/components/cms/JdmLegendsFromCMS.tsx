import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cms } from '../../lib/cms';
import { SanityImage } from '../SanityImage';

interface JdmLegend {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  year: string;
  specs: string[];
}

export const JdmLegendsFromCMS: React.FC = () => {
  const [legends, setLegends] = useState<JdmLegend[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLegends = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const data = await cms.getJdmLegends();
          if (data && data.length > 0) {
            setLegends(data);
          } else {
            // If we get empty data, use fallback
            throw new Error('No legends data available');
          }
        } catch (err: any) {
          console.error('Failed to load JDM legends:', err);
          setError(err.error || 'Failed to load content');
          // Use fallback data
          setLegends(getFallbackLegends());
        }
      } finally {
        setLoading(false);
      }
    };

    loadLegends();
  }, [retryCount]);

  const getFallbackLegends = (): JdmLegend[] => {
    return [
      {
        _id: '1',
        name: 'Nissan Skyline GT-R R34',
        description: 'The legendary Godzilla, featuring the iconic RB26DETT engine and ATTESA E-TS AWD system.',
        imageUrl: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80',
        year: '1999-2002',
        specs: ['RB26DETT Twin-Turbo', '280 HP', 'ATTESA E-TS AWD', '6-Speed Manual']
      },
      {
        _id: '2',
        name: 'Toyota Supra MK4',
        description: 'The iconic Supra featuring the legendary 2JZ-GTE engine, known for its incredible tuning potential.',
        imageUrl: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80',
        year: '1993-2002',
        specs: ['2JZ-GTE Twin-Turbo', '320 HP', 'RWD', '6-Speed Manual']
      },
      {
        _id: '3',
        name: 'Mazda RX-7 FD',
        description: 'The pinnacle of rotary engine performance, featuring the unique 13B-REW twin-turbo powerplant.',
        imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80',
        year: '1992-2002',
        specs: ['13B-REW Twin-Rotor', '280 HP', 'RWD', 'Sequential Twin-Turbo']
      }
    ];
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  const nextSlide = () => {
    if (!isTransitioning && legends.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % legends.length);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning && legends.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + legends.length) % legends.length);
    }
  };

  useEffect(() => {
    if (legends.length <= 1) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [legends.length, isTransitioning]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  if (loading) {
    return (
      <section className="bg-midnight py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 w-1/4 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[400px] bg-gray-700"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-700 w-3/4"></div>
                <div className="h-4 bg-gray-700 w-1/4"></div>
                <div className="h-24 bg-gray-700"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-700"></div>
                  <div className="h-12 bg-gray-700"></div>
                  <div className="h-12 bg-gray-700"></div>
                  <div className="h-12 bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (legends.length === 0) {
    return null;
  }

  return (
    <section className="bg-midnight py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-zen text-racing-red text-center mb-12">JDM Legends</h2>
        
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={handleTransitionEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[400px] group">
                  {legends[currentIndex]?.imageUrl ? (
                    <SanityImage
                      image={legends[currentIndex].imageUrl}
                      alt={legends[currentIndex].name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">Image not available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="text-white space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-zen">{legends[currentIndex].name}</h3>
                    <p className="text-racing-red font-zen">{legends[currentIndex].year}</p>
                  </div>
                  
                  <p className="text-gray-300">{legends[currentIndex].description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {legends[currentIndex].specs.map((spec, index) => (
                      <div key={index} className="bg-black/30 p-3 border border-gray-700">
                        <p className="text-sm text-gray-300">{spec}</p>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/inventory?search=${encodeURIComponent(legends[currentIndex].name)}`)}
                    className="bg-racing-red text-white px-8 py-3 hover:bg-red-700 transition font-zen"
                  >
                    Find Similar
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 hover:bg-black/70 transition"
            disabled={isTransitioning}
            aria-label="Previous legend"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 hover:bg-black/70 transition"
            disabled={isTransitioning}
            aria-label="Next legend"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {legends.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-racing-red' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JdmLegendsFromCMS;
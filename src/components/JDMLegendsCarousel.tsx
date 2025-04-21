import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Legend {
  id: string;
  name: string;
  description: string;
  image: string;
  year: string;
  specs: string[];
}

const legends: Legend[] = [
  {
    id: '1',
    name: 'Nissan Skyline GT-R R34',
    description: 'The legendary Godzilla, featuring the iconic RB26DETT engine and ATTESA E-TS AWD system.',
    image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80',
    year: '1999-2002',
    specs: ['RB26DETT Twin-Turbo', '280 HP', 'ATTESA E-TS AWD', '6-Speed Manual']
  },
  {
    id: '2',
    name: 'Toyota Supra MK4',
    description: 'The iconic Supra featuring the legendary 2JZ-GTE engine, known for its incredible tuning potential.',
    image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80',
    year: '1993-2002',
    specs: ['2JZ-GTE Twin-Turbo', '320 HP', 'RWD', '6-Speed Manual']
  },
  {
    id: '3',
    name: 'Mazda RX-7 FD',
    description: 'The pinnacle of rotary engine performance, featuring the unique 13B-REW twin-turbo powerplant.',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80',
    year: '1992-2002',
    specs: ['13B-REW Twin-Rotor', '280 HP', 'RWD', 'Sequential Twin-Turbo']
  },
  {
    id: '4',
    name: 'Honda NSX-R',
    description: 'The everyday supercar that challenged Ferrari, developed with input from Ayrton Senna.',
    image: 'https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&q=80',
    year: '1992-2005',
    specs: ['3.2L V6 VTEC', '290 HP', 'RWD', '6-Speed Manual']
  },
  {
    id: '5',
    name: 'Mitsubishi Lancer Evolution VI TME',
    description: 'The Tommi Mäkinen Edition, a rally-bred machine that dominated the WRC.',
    image: 'https://images.unsplash.com/photo-1609952048180-7b35ea6b083b?auto=format&fit=crop&q=80',
    year: '1999-2001',
    specs: ['4G63T Turbo', '280 HP', 'AWD', '5-Speed Manual']
  }
];

export const JDMLegendsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % legends.length);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + legends.length) % legends.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <section className="bg-midnight py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-zen text-racing-red text-center mb-12">JDM Legends</h2>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {legends.map((legend) => (
              <div 
                key={legend.id}
                className="w-full flex-shrink-0 px-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[400px] group">
                    <img
                      src={legend.image}
                      alt={legend.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="text-white space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-zen">{legend.name}</h3>
                      <p className="text-racing-red font-zen">{legend.year}</p>
                    </div>
                    
                    <p className="text-gray-300">{legend.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {legend.specs.map((spec, index) => (
                        <div key={index} className="bg-black/30 p-3 border border-gray-700">
                          <p className="text-sm text-gray-300">{spec}</p>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => navigate(`/inventory?search=${encodeURIComponent(legend.name)}`)}
                      className="bg-racing-red text-white px-8 py-3 hover:bg-red-700 transition font-zen"
                    >
                      Find Similar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 hover:bg-black/70 transition"
            disabled={isTransitioning}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 hover:bg-black/70 transition"
            disabled={isTransitioning}
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
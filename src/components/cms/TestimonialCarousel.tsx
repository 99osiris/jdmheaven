import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cms } from '../../lib/cms';
import { SanityImage } from '../SanityImage';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export const TestimonialCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await cms.getTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading) {
    return (
      <div className="bg-midnight py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 w-1/4 mx-auto mb-8"></div>
            <div className="h-32 bg-gray-700 mb-6"></div>
            <div className="h-6 bg-gray-700 w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-midnight py-16">
      <div className="max-w-4xl mx-auto px-4 relative">
        <h2 className="text-3xl font-zen text-racing-red text-center mb-12">What Our Clients Say</h2>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-racing-red">
                  {testimonials[currentIndex].image ? (
                    <SanityImage
                      image={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-2xl">
                        {testimonials[currentIndex].name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative mb-6 text-white">
                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-racing-red opacity-30" />
                <p className="text-xl italic">"{testimonials[currentIndex].quote}"</p>
              </div>
              
              <div>
                <h3 className="text-xl font-zen text-white">{testimonials[currentIndex].name}</h3>
                <p className="text-racing-red">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 hover:bg-black/50 transition"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 hover:bg-black/50 transition"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Dots navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-racing-red' : 'bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;
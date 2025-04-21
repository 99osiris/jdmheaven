import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cms } from '../../lib/cms';
import { motion } from 'framer-motion';
import { Truck, FileText, Shield, Clock, RefreshCw } from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

interface ErrorState {
  message: string;
  isRetryable: boolean;
}

export const ServicesFromCMS: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const data = await cms.getServices();
          if (data && data.length > 0) {
            setServices(data);
          } else {
            // If we get empty data, use fallback
            throw new Error('No services data available');
          }
        } catch (err: any) {
          console.error('Error loading services:', err);
          const errorResponse = err.error || 'Failed to load services';
          const isRetryable = err.code === 'NETWORK_ERROR' || err.code === 'API_ERROR';
          setError({ message: errorResponse, isRetryable });
          
          // Use fallback data
          setServices(getFallbackServices());
        }
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [retryCount]);

  const getFallbackServices = (): Service[] => {
    return [
      {
        _id: '1',
        title: 'Door-to-Door Delivery',
        description: 'Complete shipping service from Japan to your location anywhere in Europe',
        icon: 'truck'
      },
      {
        _id: '2',
        title: 'Documentation Support',
        description: 'Full assistance with customs clearance and vehicle registration',
        icon: 'fileText'
      },
      {
        _id: '3',
        title: 'Quality Guarantee',
        description: 'Thorough inspection and verification of all vehicles before purchase',
        icon: 'shield'
      },
      {
        _id: '4',
        title: 'Fast Processing',
        description: 'Efficient handling of your order from selection to delivery',
        icon: 'clock'
      }
    ];
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Function to render the icon based on the icon name
  const renderIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      truck: <Truck className="w-12 h-12 text-racing-red" />,
      fileText: <FileText className="w-12 h-12 text-racing-red" />,
      shield: <Shield className="w-12 h-12 text-racing-red" />,
      clock: <Clock className="w-12 h-12 text-racing-red" />,
    };

    return iconMap[iconName] || <div className="w-12 h-12 bg-racing-red"></div>;
  };

  if (loading) {
    return (
      <section className="py-20 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 bg-black/30 rounded-none border border-gray-700">
                  <div className="h-12 w-12 bg-gray-700 mb-4"></div>
                  <div className="h-6 bg-gray-700 w-3/4 mb-2"></div>
                  <div className="h-16 bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-midnight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-zen text-racing-red mb-4">Our Services</h2>
          <p className="text-lg text-gray-300">Comprehensive import solutions tailored to your needs</p>
          
          {error && (
            <div className="mt-4 inline-block bg-black/30 p-4 rounded-none border border-racing-red/20">
              <p className="text-gray-300 mb-2">{error.message}</p>
              {error.isRetryable && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 bg-black/30 rounded-none border border-racing-red/20 hover:border-racing-red transition duration-300"
            >
              <div className="mb-4">{renderIcon(service.icon)}</div>
              <h3 className="text-xl font-zen text-white mb-2">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/import-process"
            className="inline-flex items-center px-8 py-4 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
          >
            Learn More About Our Process
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesFromCMS;
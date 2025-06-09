import React from 'react';
import { Wrench, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from './SEO';

export const MaintenancePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Under Maintenance | JDM HEAVEN"
        description="We're currently performing maintenance to improve your experience. We'll be back shortly with more JDM legends!"
        type="website"
      />
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="JDM Heaven Logo"
                className="h-24 mx-auto"
              />
            </div>

            {/* Main Content */}
            <div className="bg-black/30 backdrop-blur-sm p-8 sm:p-12 rounded-lg mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-racing-red/10 rounded-full flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-racing-red animate-spin-slow" />
                </div>
              </div>

              <h1 className="font-zen text-4xl sm:text-5xl md:text-6xl text-racing-red mb-4">
                Under Maintenance
              </h1>

              <p className="text-white text-lg sm:text-xl max-w-2xl mx-auto mb-8">
                We're tuning up our website to bring you an even better JDM experience.
                Just like a perfectly balanced engine, we'll be back running at peak performance soon.
              </p>

              <div className="flex items-center justify-center gap-2 text-white/70 mb-8">
                <Clock className="w-5 h-5" />
                <span>Estimated completion: 2-3 hours</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://instagram.com/jdmheaven"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
                >
                  Follow Our Updates
                  <ChevronRight className="ml-2" size={20} />
                </a>
                <a
                  href="mailto:support@jdmheaven.club"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-none hover:bg-white/20 transition font-zen"
                >
                  Contact Support
                </a>
              </div>
            </div>

            {/* Footer */}
            <p className="text-white/50 text-sm">
              Thank you for your patience. We're making JDM Heaven even better for you.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MaintenancePage; 
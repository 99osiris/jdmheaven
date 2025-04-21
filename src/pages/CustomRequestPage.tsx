import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CustomRequestForm } from '../components/CustomRequestForm';
import { Car, FileCheck, Clock } from 'lucide-react';
import BackButton from '../components/BackButton';

const CustomRequestPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <BackButton className="mr-4" />
          </div>
          <h1 className="text-4xl font-zen mb-6">Custom Car Request</h1>
          <p className="text-xl text-gray-300">Tell us about your dream JDM car</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-midnight p-8">
              <h2 className="text-2xl font-zen text-white mb-6">Submit Your Request</h2>
              <CustomRequestForm />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-midnight p-6">
              <h3 className="text-xl font-zen text-white mb-4">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Car className="w-6 h-6 text-racing-red flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-zen text-white">1. Submit Request</h4>
                    <p className="mt-1 text-gray-300">
                      Tell us what you're looking for - make, model, specs, and budget.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FileCheck className="w-6 h-6 text-racing-red flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-zen text-white">2. Review & Search</h4>
                    <p className="mt-1 text-gray-300">
                      Our team reviews your request and searches Japanese auctions and dealers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-racing-red flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-zen text-white">3. Get Updates</h4>
                    <p className="mt-1 text-gray-300">
                      We'll keep you updated on matches and potential options.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-racing-red/20 p-6">
              <h3 className="text-xl font-zen text-racing-red mb-4">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                Not sure about specifications or have questions? Our team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-block w-full bg-racing-red text-white text-center py-3 font-zen hover:bg-red-700 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRequestPage;
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Car, FileText, PenTool as Tool } from 'lucide-react';
import { vinApi } from '../lib/api/vin';
import type { VinDecoderResult } from '../lib/api/vin';
import { VehicleTracker } from '../components/VehicleTracker';
import BackButton from '../components/BackButton';

const VinDecoderPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vin = searchParams.get('vin');

  const [result, setResult] = useState<VinDecoderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decodeVin = async () => {
      if (!vin) return;

      setLoading(true);
      setError(null);

      try {
        const data = await vinApi.decode(vin);
        setResult(data);
        await vinApi.saveSearch(vin, data);
      } catch (err) {
        console.error('Error decoding VIN:', err);
        setError('Failed to decode VIN. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    decodeVin();
  }, [vin]);

  if (!vin) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">No VIN provided. Please enter a VIN number.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <BackButton className="mr-4" />
          </div>
          <h1 className="text-4xl font-zen mb-6">Vehicle Information</h1>
          <p className="text-xl text-gray-300">VIN: {vin}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicle information...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          </div>
        ) : result ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Car className="w-6 h-6 text-racing-red" />
                    <h2 className="text-xl font-zen ml-2">Basic Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Make</p>
                      <p className="text-xl font-zen">{result.make}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Model</p>
                      <p className="text-xl font-zen">{result.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Year</p>
                      <p className="text-xl font-zen">{result.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Series</p>
                      <p className="text-xl font-zen">{result.series}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Tool className="w-6 h-6 text-racing-red" />
                    <h2 className="text-xl font-zen ml-2">Technical Specs</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Engine</p>
                      <p className="text-xl font-zen">{result.engine}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Transmission</p>
                      <p className="text-xl font-zen">{result.transmission}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Body Type</p>
                      <p className="text-xl font-zen">{result.bodyType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Drive Type</p>
                      <p className="text-xl font-zen">{result.driveType}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-racing-red" />
                    <h2 className="text-xl font-zen ml-2">Manufacturing Info</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">Manufacturer</p>
                      <p className="text-xl font-zen">{result.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Plant Country</p>
                      <p className="text-xl font-zen">{result.plantCountry}</p>
                    </div>
                  </div>
                </div>
              </div>

              <VehicleTracker vin={vin} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white shadow-lg p-6">
                  <h3 className="text-xl font-zen text-midnight mb-4">Vehicle Documents</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-zen text-sm mb-2">Export Certificate</h4>
                      <p className="text-sm text-gray-600">Japanese export documentation and customs clearance papers</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-zen text-sm mb-2">Inspection Report</h4>
                      <p className="text-sm text-gray-600">Vehicle condition report and inspection details</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-zen text-sm mb-2">Service History</h4>
                      <p className="text-sm text-gray-600">Maintenance records and service documentation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VinDecoderPage;
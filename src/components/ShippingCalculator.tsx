import React, { useState } from 'react';
import { Package, Truck, DollarSign, Ruler, AlertTriangle, Info } from 'lucide-react';
import { shippingApi } from '../lib/api/shipping';
import type { ShippingRate } from '../lib/api/shipping';

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

const ShippingCalculator = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: 0,
    width: 0,
    height: 0
  });
  const [weight, setWeight] = useState<number>(0);
  const [destination, setDestination] = useState<string>('');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destinations = shippingApi.getDestinations();

  const calculateCBM = (): number => {
    const { length, width, height } = dimensions;
    return (length * width * height) / 1000000; // Convert cm³ to m³
  };

  const calculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWarnings([]);

    try {
      const result = await shippingApi.calculateRates(
        {
          ...dimensions,
          weight
        },
        'JP', // Origin is always Japan
        destination
      );

      setRates(result.rates);
      setWarnings(result.warnings || []);
    } catch (err) {
      console.error('Error calculating shipping:', err);
      setError('Failed to calculate shipping rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDimensionChange = (dimension: keyof Dimensions, value: string) => {
    const numValue = Number(value);
    setDimensions(prev => ({
      ...prev,
      [dimension]: numValue
    }));
  };

  const cbm = calculateCBM();

  const selectedDestination = destinations.find(d => d.code === destination);

  return (
    <div className="bg-midnight text-white p-6 rounded-none">
      <div className="flex items-center mb-6">
        <Truck className="w-6 h-6 text-racing-red mr-2" />
        <h2 className="text-xl font-zen">Shipping Calculator</h2>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500 p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 mr-2" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={calculateShipping} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-zen flex items-center">
            <Ruler className="w-4 h-4 mr-2 text-racing-red" />
            Vehicle Dimensions (cm)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Length</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={dimensions.length || ''}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                className="w-full py-2 px-3 bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Width</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={dimensions.width || ''}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="w-full py-2 px-3 bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Height</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={dimensions.height || ''}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="w-full py-2 px-3 bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
                required
              />
            </div>
          </div>
          {cbm > 0 && (
            <div className="bg-black/30 p-3 border border-gray-700">
              <p className="text-sm">
                Volume: <span className="text-racing-red font-zen">{cbm.toFixed(2)} m³</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-zen mb-2 flex items-center">
            <Package className="w-4 h-4 mr-2 text-racing-red" />
            Vehicle Weight (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              min="500"
              max="3000"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full py-3 px-4 bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
              placeholder="Enter vehicle weight"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Typical JDM vehicle weights: Skyline GT-R (1500kg), Supra (1550kg), RX-7 (1250kg)
          </p>
        </div>

        <div>
          <label className="block text-sm font-zen mb-2">
            Destination Country
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full py-3 px-4 bg-black/30 text-white border border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
            required
          >
            <option value="">Select destination</option>
            {destinations.map((dest) => (
              <option key={dest.code} value={dest.code}>
                {dest.name}
              </option>
            ))}
          </select>

          {selectedDestination?.restrictions && (
            <div className="mt-2 bg-yellow-900/20 border border-yellow-500/50 p-3">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5 mr-2" />
                <ul className="text-sm text-yellow-500 list-disc pl-4">
                  {selectedDestination.restrictions.map((restriction, index) => (
                    <li key={index}>{restriction}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate Shipping'}
        </button>
      </form>

      {warnings.length > 0 && (
        <div className="mt-6 bg-yellow-900/20 border border-yellow-500 p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5 mr-2" />
            <ul className="text-sm text-yellow-500 list-disc pl-4">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {rates.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-zen mb-4">Shipping Options</h3>
          <div className="space-y-4">
            {rates.map((rate, index) => (
              <div
                key={index}
                className="bg-black/30 border border-gray-700 p-4 hover:border-racing-red transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-zen">{rate.service}</h4>
                    <p className="text-sm text-gray-400">via {rate.provider}</p>
                  </div>
                  <div className="flex items-center text-racing-red">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-zen">€{rate.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  <p>Total transit time: {rate.transitTime}</p>
                  <p>Door-to-door duration: {rate.duration}</p>
                </div>
                {rate.restrictions && (
                  <div className="mt-3 text-sm">
                    <p className="text-gray-400 mb-1">Restrictions:</p>
                    <ul className="list-disc pl-4 text-gray-500">
                      {rate.restrictions.map((restriction, idx) => (
                        <li key={idx}>{restriction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-400">
            * Rates are estimates and may vary based on actual vehicle specifications and shipping conditions.
            Final costs will be confirmed after vehicle inspection and documentation review.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VinDecoderQuick = () => {
  const navigate = useNavigate();
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (vin.length !== 17) {
      setError('VIN must be 17 characters long');
      return;
    }

    navigate(`/vin-decoder?vin=${vin}`);
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    setError(null);
  };

  return (
    <div className="bg-midnight p-6 rounded-none">
      <h2 className="text-xl font-zen text-white mb-4">VIN Decoder</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={vin}
            onChange={handleVinChange}
            placeholder="Enter 17-digit VIN number"
            className="w-full py-3 px-4 pl-12 bg-black/30 text-white placeholder-gray-400 border border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
            maxLength={17}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" />
        </div>
        {error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition"
        >
          Decode VIN
        </button>
      </form>
    </div>
  );
};
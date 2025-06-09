import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export const VinDecoderQuick: React.FC = () => {
  const [vin, setVin] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim()) {
      navigate(`/vin-decoder?vin=${encodeURIComponent(vin.trim())}`);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-none border border-white/20">
      <h3 className="text-xl font-zen mb-4 text-racing-red">Quick VIN Check</h3>
      <p className="text-sm mb-4 text-gray-300">
        Decode your Japanese vehicle's VIN number instantly
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Enter VIN number..."
            className="w-full py-3 px-4 pl-10 bg-white/10 text-white placeholder-gray-300 border border-white/20 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red transition"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            maxLength={17}
          />
          <Search className="absolute left-3 top-3.5 text-gray-300" size={16} />
        </div>
        
        <button
          type="submit"
          className="w-full bg-racing-red text-white py-3 rounded-none hover:bg-red-700 transition font-zen text-sm"
          disabled={!vin.trim()}
        >
          Decode VIN
        </button>
      </form>
      
      <p className="text-xs mt-4 text-gray-400">
        Get detailed information about your vehicle's make, model, year, and more.
      </p>
    </div>
  );
};
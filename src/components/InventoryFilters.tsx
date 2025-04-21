import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

export interface FilterValues {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMin: string;
  mileageMax: string;
  handling: string;
  transmission: string;
  drivetrain: string;
  engineType: string;
  horsepowerMin: string;
  horsepowerMax: string;
}

interface InventoryFiltersProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
}

const MAKES = ['Nissan', 'Toyota', 'Honda', 'Mazda', 'Mitsubishi', 'Subaru'];
const HANDLING = ['left', 'right'];
const TRANSMISSION = ['manual', 'automatic', 'semi-automatic'];
const DRIVETRAIN = ['2WD', '4WD', 'AWD', 'RWD', 'FWD'];
const ENGINE_TYPES = ['RB26DETT', '2JZ-GTE', '13B-REW', 'C32B', '4G63T', 'EJ20'];

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (field: keyof FilterValues, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-auto px-6 py-3 bg-midnight text-white hover:bg-gray-900 transition"
      >
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Advanced Filters
        </div>
        <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 bg-white p-6 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Make & Model */}
            <div>
              <label className="block text-sm font-zen text-gray-700 mb-2">Make</label>
              <select
                value={filters.make}
                onChange={(e) => handleChange('make', e.target.value)}
                className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
              >
                <option value="">All Makes</option>
                {MAKES.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-zen text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={filters.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="e.g., Skyline GT-R"
                className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
              />
            </div>

            {/* Year Range */}
            <div className="space-y-2">
              <label className="block text-sm font-zen text-gray-700">Year Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.yearMin}
                  onChange={(e) => handleChange('yearMin', e.target.value)}
                  placeholder="From"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
                <input
                  type="number"
                  value={filters.yearMax}
                  onChange={(e) => handleChange('yearMax', e.target.value)}
                  placeholder="To"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-zen text-gray-700">Price Range (€)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handleChange('priceMin', e.target.value)}
                  placeholder="Min"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handleChange('priceMax', e.target.value)}
                  placeholder="Max"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
              </div>
            </div>

            {/* Mileage Range */}
            <div className="space-y-2">
              <label className="block text-sm font-zen text-gray-700">Mileage (km)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.mileageMin}
                  onChange={(e) => handleChange('mileageMin', e.target.value)}
                  placeholder="Min"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
                <input
                  type="number"
                  value={filters.mileageMax}
                  onChange={(e) => handleChange('mileageMax', e.target.value)}
                  placeholder="Max"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
              </div>
            </div>

            {/* Handling & Transmission */}
            <div>
              <label className="block text-sm font-zen text-gray-700 mb-2">Handling</label>
              <select
                value={filters.handling}
                onChange={(e) => handleChange('handling', e.target.value)}
                className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
              >
                <option value="">All</option>
                <option value="right">Right Hand Drive</option>
                <option value="left">Left Hand Drive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-zen text-gray-700 mb-2">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => handleChange('transmission', e.target.value)}
                className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
              >
                <option value="">All</option>
                {TRANSMISSION.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Drivetrain & Engine */}
            <div>
              <label className="block text-sm font-zen text-gray-700 mb-2">Drivetrain</label>
              <select
                value={filters.drivetrain}
                onChange={(e) => handleChange('drivetrain', e.target.value)}
                className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
              >
                <option value="">All</option>
                {DRIVETRAIN.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-zen text-gray-700 mb-2">Engine Type</label>
              <select
                value={filters.engineType}
                onChange={(e) => handleChange('engineType', e.target.value)}
                className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
              >
                <option value="">All</option>
                {ENGINE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Horsepower Range */}
            <div className="space-y-2">
              <label className="block text-sm font-zen text-gray-700">Horsepower Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.horsepowerMin}
                  onChange={(e) => handleChange('horsepowerMin', e.target.value)}
                  placeholder="Min HP"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
                <input
                  type="number"
                  value={filters.horsepowerMax}
                  onChange={(e) => handleChange('horsepowerMax', e.target.value)}
                  placeholder="Max HP"
                  className="w-full border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-racing-red text-white hover:bg-red-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
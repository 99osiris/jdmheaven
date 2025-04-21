import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersProps {
  onFilter: (filters: FilterOption[]) => void;
  onReset: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFilter,
  onReset,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterOption[]>([]);

  const operators = {
    text: ['contains', 'equals', 'starts with', 'ends with'],
    number: ['equals', 'greater than', 'less than', 'between'],
    date: ['equals', 'after', 'before', 'between'],
    boolean: ['equals'],
  };

  const fields = [
    { name: 'make', type: 'text', label: 'Make' },
    { name: 'model', type: 'text', label: 'Model' },
    { name: 'year', type: 'number', label: 'Year' },
    { name: 'price', type: 'number', label: 'Price' },
    { name: 'status', type: 'text', label: 'Status' },
    { name: 'created_at', type: 'date', label: 'Created Date' },
  ];

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: '', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterOption, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters([]);
    onReset();
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-racing-red transition"
      >
        <Filter className="w-4 h-4 mr-2" />
        Advanced Filters
      </button>

      {isOpen && (
        <div className="mt-4 bg-white p-6 shadow-lg rounded-none">
          <div className="space-y-4">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-4">
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(index, 'field', e.target.value)}
                  className="flex-1 rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                >
                  <option value="">Select Field</option>
                  {fields.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                  className="flex-1 rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                >
                  <option value="">Select Operator</option>
                  {filter.field && fields.find(f => f.name === filter.field)?.type &&
                    operators[fields.find(f => f.name === filter.field)?.type as keyof typeof operators].map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))
                  }
                </select>

                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                />

                <button
                  onClick={() => removeFilter(index)}
                  className="text-gray-400 hover:text-racing-red transition"
                >
                  <X size={20} />
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <button
                onClick={addFilter}
                className="text-sm text-racing-red hover:text-red-700 transition"
              >
                + Add Filter
              </button>

              <div className="space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 text-sm bg-racing-red text-white hover:bg-red-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
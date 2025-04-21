import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 px-4 pl-12 pr-10 bg-gray-100 rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
      />
      <Search className="absolute left-4 top-3.5 text-gray-400" />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-3.5 text-gray-400 hover:text-racing-red"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
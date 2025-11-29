import React from 'react';
import { X } from 'lucide-react';
import { analytics } from '../lib/analytics';

export interface QuickFilter {
  id: string;
  label: string;
  filter: () => void;
  active?: boolean;
}

interface QuickFilterChipsProps {
  filters: QuickFilter[];
  onClear?: () => void;
}

export const QuickFilterChips: React.FC<QuickFilterChipsProps> = ({ filters, onClear }) => {
  const handleFilterClick = (filter: QuickFilter) => {
    analytics.filterUse('quick_filter', filter.id);
    filter.filter();
  };

  const activeFilters = filters.filter((f) => f.active);

  if (filters.length === 0 && activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Quick Filter Chips */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-text-secondary self-center mr-2">Quick Filters:</span>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-none text-sm font-medium transition-fast ${
                filter.active
                  ? 'bg-racing-red text-white shadow-glow'
                  : 'bg-midnight-light text-text-secondary hover:bg-midnight-lighter hover:text-text-primary border border-charcoal'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-text-secondary mr-2">Active:</span>
          {activeFilters.map((filter) => (
            <span
              key={filter.id}
              className="px-3 py-1 rounded-none text-sm bg-racing-red-alpha text-racing-red border border-racing-red flex items-center gap-2"
            >
              {filter.label}
              {onClear && (
                <button
                  onClick={() => {
                    onClear();
                    analytics.filterReset();
                  }}
                  className="hover:text-racing-red-dark"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};


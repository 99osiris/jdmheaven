import React, { useState, useEffect } from 'react';
import { Save, X, Bookmark } from 'lucide-react';
import { FilterValues } from './InventoryFilters';
import { analytics } from '../lib/analytics';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterValues;
  createdAt: string;
}

interface FilterPresetsProps {
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
}

const STORAGE_KEY = 'jdmheaven_filter_presets';

export const FilterPresets: React.FC<FilterPresetsProps> = ({ filters, onApply }) => {
  const { user } = useAuth();
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading filter presets:', error);
    }
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowSaveDialog(false);
    setPresetName('');
    analytics.filterSave(presetName.trim());
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const applyPreset = (preset: FilterPreset) => {
    onApply(preset.filters);
    analytics.filterUse('preset', preset.name);
  };

  if (presets.length === 0 && !showSaveDialog) {
    return (
      <div className="mb-6">
        <Button
          onClick={() => setShowSaveDialog(true)}
          variant="outline"
          size="sm"
        >
          <Save className="w-4 h-4" />
          Save Current Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-zen font-bold text-text-secondary flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Saved Filter Presets
        </h3>
        <Button
          onClick={() => setShowSaveDialog(true)}
          variant="ghost"
          size="sm"
        >
          <Save className="w-4 h-4" />
          Save Current
        </Button>
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-midnight-light border border-charcoal hover:border-racing-red transition-fast group"
            >
              <button
                onClick={() => applyPreset(preset)}
                className="text-sm text-text-primary hover:text-racing-red transition-fast"
              >
                {preset.name}
              </button>
              <button
                onClick={() => deletePreset(preset.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-error"
                aria-label={`Delete ${preset.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showSaveDialog && (
        <div className="p-4 bg-midnight-light border border-charcoal">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name (e.g., 'Under 30k RHD')"
              className="flex-1 px-3 py-2 bg-midnight border border-charcoal text-text-primary focus:outline-none focus:ring-2 focus:ring-racing-red"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  savePreset();
                }
              }}
              autoFocus
            />
            <Button
              onClick={savePreset}
              variant="primary"
              size="sm"
              disabled={!presetName.trim()}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setShowSaveDialog(false);
                setPresetName('');
              }}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


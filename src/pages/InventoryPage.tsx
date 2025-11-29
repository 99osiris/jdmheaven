import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CarCard } from '../components/CarCard';
import { CompareDrawer } from '../components/CompareDrawer';
import { VinDecoderQuick } from '../components/VinDecoderQuick';
import { StockAlertForm } from '../components/StockAlertForm';
import { InventoryFilters, FilterValues } from '../components/InventoryFilters';
import { InventoryStatus } from '../components/InventoryStatus';
import { QuickFilterChips, QuickFilter } from '../components/QuickFilterChips';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { analytics } from '../lib/analytics';
import { toast } from '../components/Toast';
import type { Car } from '../types';

const InventoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<Car[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    mileageMin: '',
    mileageMax: '',
    handling: '',
    transmission: '',
    drivetrain: '',
    engineType: '',
    horsepowerMin: '',
    horsepowerMax: '',
  });

  // Quick filter handlers
  const quickFilters: QuickFilter[] = [
    {
      id: 'under_30k',
      label: 'Under €30k',
      filter: () => {
        setFilters(prev => ({ ...prev, priceMax: '30000' }));
        analytics.filterUse('quick', 'under_30k');
      },
      active: filters.priceMax === '30000',
    },
    {
      id: 'rhd_only',
      label: 'RHD Only',
      filter: () => {
        setFilters(prev => ({ ...prev, handling: 'right' }));
        analytics.filterUse('quick', 'rhd_only');
      },
      active: filters.handling === 'right',
    },
    {
      id: 'new_arrivals',
      label: 'New Arrivals',
      filter: () => {
        // Filter by created_at in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        // This would need backend support, for now just track
        analytics.filterUse('quick', 'new_arrivals');
      },
    },
    {
      id: 'available',
      label: 'Available Now',
      filter: () => {
        // Filter by status = available
        analytics.filterUse('quick', 'available');
      },
    },
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await api.cars.getAll();
        setCars(data);
        analytics.search(searchQuery || 'all', data.length);
      } catch (err) {
        setError('Failed to load cars. Please try again later.');
        console.error('Error fetching cars:', err);
        toast.error('Failed to load inventory');
        analytics.error('Failed to load inventory', '/inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleAddToCompare = (car: Car) => {
    if (compareList.length >= 3) {
      toast.warning('You can only compare up to 3 cars at a time.');
      return;
    }
    if (compareList.some(c => c.id === car.id)) {
      setCompareList(compareList.filter(c => c.id !== car.id));
    } else {
      setCompareList([...compareList, car]);
      toast.success('Added to comparison');
    }
  };

  const handleRemoveFromCompare = (car: Car) => {
    setCompareList(compareList.filter(c => c.id !== car.id));
    toast.info('Removed from comparison');
  };

  const handleSaveComparison = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (compareList.length < 2) {
      toast.warning('Please select at least 2 cars to compare.');
      return;
    }

    try {
      const name = `Comparison ${new Date().toLocaleDateString()}`;
      const comparison = await api.comparisons.create(name, compareList.map(car => car.id));
      setCompareList([]);
      navigate(`/comparison/${comparison.id}`);
      toast.success('Comparison saved successfully');
    } catch (err) {
      console.error('Error saving comparison:', err);
      toast.error('Failed to save comparison');
    }
  };

  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      priceMin: '',
      priceMax: '',
      mileageMin: '',
      mileageMax: '',
      handling: '',
      transmission: '',
      drivetrain: '',
      engineType: '',
      horsepowerMin: '',
      horsepowerMax: '',
    });
    toast.success('Filters reset');
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = searchQuery
      ? car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.reference_number.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesMake = !filters.make || car.make === filters.make;
    const matchesModel = !filters.model || car.model.toLowerCase().includes(filters.model.toLowerCase());
    const matchesYear = (!filters.yearMin || car.year >= parseInt(filters.yearMin)) &&
                       (!filters.yearMax || car.year <= parseInt(filters.yearMax));
    const matchesPrice = (!filters.priceMin || car.price >= parseInt(filters.priceMin)) &&
                        (!filters.priceMax || car.price <= parseInt(filters.priceMax));
    const matchesMileage = (!filters.mileageMin || (car.mileage || 0) >= parseInt(filters.mileageMin)) &&
                          (!filters.mileageMax || (car.mileage || 0) <= parseInt(filters.mileageMax));
    const matchesHandling = !filters.handling || car.handling === filters.handling;
    const matchesTransmission = !filters.transmission || car.transmission === filters.transmission;
    const matchesDrivetrain = !filters.drivetrain || car.drivetrain === filters.drivetrain;
    const matchesEngine = !filters.engineType || car.engine_type?.includes(filters.engineType);
    const matchesHorsepower = (!filters.horsepowerMin || (car.horsepower || 0) >= parseInt(filters.horsepowerMin)) &&
                             (!filters.horsepowerMax || (car.horsepower || 0) <= parseInt(filters.horsepowerMax));

    return matchesSearch &&
           matchesMake &&
           matchesModel &&
           matchesYear &&
           matchesPrice &&
           matchesMileage &&
           matchesHandling &&
           matchesTransmission &&
           matchesDrivetrain &&
           matchesEngine &&
           matchesHorsepower;
  });

  if (error) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-racing-red text-white px-6 py-2 font-zen"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search by make, model, or reference number..."
                  className="w-full py-3 px-4 pl-12 bg-gray-800 text-white rounded-none focus:outline-none focus:ring-2 focus:ring-racing-red"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <QuickFilterChips
          filters={quickFilters}
          onClear={resetFilters}
        />
        
        <InventoryFilters
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 space-y-8">
            <div className="sticky top-24 space-y-8">
              <VinDecoderQuick />
              {user && <StockAlertForm />}
            </div>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading inventory...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onAddToCompare={handleAddToCompare}
                    isInCompare={compareList.some(c => c.id === car.id)}
                  />
                ))}
              </div>
            )}

            {filteredCars.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">No cars found matching your criteria.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-racing-red hover:text-red-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Section */}
        <RecentlyViewed />
      </div>

      <CompareDrawer
        cars={compareList}
        onRemove={handleRemoveFromCompare}
        onClose={() => setCompareList([])}
        onSave={handleSaveComparison}
      />
    </div>
  );
};

export default InventoryPage;
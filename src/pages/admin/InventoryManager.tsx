import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cmsApi } from '../../lib/api/cms';
import { CarForm } from '../../components/admin/CarForm';
import { BulkActions } from '../../components/admin/BulkActions';
import { AdvancedFilters } from '../../components/admin/AdvancedFilters';
import type { Car } from '../../types';

const InventoryManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<any[]>([]);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await cmsApi.cars.getAll();
      setCars(data);
    } catch (err) {
      console.error('Error loading cars:', err);
      setError('Failed to load cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingCar) {
        // Ensure car ID is included in the update
        await cmsApi.cars.update({
          ...data.car,
          id: editingCar.id
        }, data.images, data.specs);
      } else {
        await cmsApi.cars.create(data.car, data.images, data.specs);
      }
      setShowForm(false);
      setEditingCar(null);
      loadCars();
    } catch (err) {
      console.error('Error saving car:', err);
      alert('Failed to save car. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await cmsApi.cars.delete(id);
      loadCars();
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Failed to delete car. Please try again.');
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    switch (action) {
      case 'delete':
        if (!window.confirm(`Are you sure you want to delete ${ids.length} cars?`)) return;
        try {
          await Promise.all(ids.map(id => cmsApi.cars.delete(id)));
          loadCars();
          setSelectedIds([]);
        } catch (err) {
          console.error('Error deleting cars:', err);
          alert('Failed to delete cars. Please try again.');
        }
        break;

      case 'export':
        const selectedCars = cars.filter(car => ids.includes(car.id));
        const csvContent = "data:text/csv;charset=utf-8," + 
          Object.keys(selectedCars[0]).join(",") + "\n" +
          selectedCars.map(car => Object.values(car).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cars.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;

      // Add more bulk actions as needed
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === cars.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cars.map(car => car.id));
    }
  };

  const handleFilter = (newFilters: any[]) => {
    setFilters(newFilters);
    // Apply filters to the cars list
    // This is a simple implementation - enhance based on your needs
    let filtered = [...cars];
    newFilters.forEach(filter => {
      filtered = filtered.filter(car => {
        const value = car[filter.field as keyof Car];
        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(filter.value.toLowerCase());
          case 'equals':
            return String(value) === filter.value;
          case 'greater than':
            return Number(value) > Number(filter.value);
          case 'less than':
            return Number(value) < Number(filter.value);
          default:
            return true;
        }
      });
    });
    setCars(filtered);
  };

  const filteredCars = cars.filter(car => 
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.reference_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user?.user_metadata?.role === 'admin') {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">Unauthorized. Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-zen">Inventory Manager</h1>
            <button
              onClick={() => {
                setEditingCar(null);
                setShowForm(true);
              }}
              className="bg-racing-red text-white px-6 py-3 rounded-none hover:bg-red-700 transition flex items-center"
            >
              <Plus className="mr-2" />
              Add New Car
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showForm ? (
          <div className="mb-8">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCar(null);
              }}
              className="mb-4 text-gray-600 hover:text-racing-red transition"
            >
              ← Back to List
            </button>
            <CarForm
              onSubmit={handleSubmit}
              initialData={editingCar ? {
                car: editingCar,
                images: editingCar.images || [],
                specs: editingCar.specs || [],
              } : undefined}
            />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by make, model, or reference number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pl-12 bg-gray-100 rounded-none"
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" />
              </div>
            </div>

            <AdvancedFilters
              onFilter={handleFilter}
              onReset={() => {
                setFilters([]);
                loadCars();
              }}
            />

            <BulkActions
              selectedIds={selectedIds}
              onAction={handleBulkAction}
              onSelectAll={handleSelectAll}
              isAllSelected={selectedIds.length === cars.length}
              totalItems={cars.length}
            />

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading inventory...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-none overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-8 px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === cars.length}
                          onChange={handleSelectAll}
                          className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Make & Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCars.map((car) => (
                      <tr key={car.id}>
                        <td className="w-8 px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(car.id)}
                            onChange={() => {
                              if (selectedIds.includes(car.id)) {
                                setSelectedIds(selectedIds.filter(id => id !== car.id));
                              } else {
                                setSelectedIds([...selectedIds, car.id]);
                              }
                            }}
                            className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {car.reference_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {car.make} {car.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {car.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{car.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            car.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {car.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingCar(car);
                              setShowForm(true);
                            }}
                            className="text-racing-red hover:text-red-700 mr-4"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
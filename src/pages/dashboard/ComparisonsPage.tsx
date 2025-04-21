import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SEO } from '../../components/SEO';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Car, Trash2 } from 'lucide-react';
import { toast } from '../../components/Toast';
import type { CarComparison } from '../../types';

const ComparisonsPage = () => {
  const [comparisons, setComparisons] = React.useState<CarComparison[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadComparisons = async () => {
      try {
        const data = await api.comparisons.getAll();
        setComparisons(data);
      } catch (error) {
        console.error('Error loading comparisons:', error);
        toast.error('Failed to load comparisons');
      } finally {
        setLoading(false);
      }
    };

    loadComparisons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comparison?')) {
      return;
    }

    try {
      await api.comparisons.delete(id);
      setComparisons(comparisons.filter(c => c.id !== id));
      toast.success('Comparison deleted');
    } catch (error) {
      console.error('Error deleting comparison:', error);
      toast.error('Failed to delete comparison');
    }
  };

  return (
    <>
      <SEO 
        title="My Comparisons"
        description="View and manage your car comparisons"
      />
      
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-zen">My Comparisons</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-6 shadow-sm">
                  <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 w-1/4"></div>
                </div>
              ))}
            </div>
          ) : comparisons.length > 0 ? (
            <div className="space-y-4">
              {comparisons.map((comparison) => (
                <div key={comparison.id} className="bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-zen mb-2">{comparison.name}</h3>
                      <p className="text-gray-500">
                        {comparison.cars.length} cars • Created {new Date(comparison.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/comparison/${comparison.id}`}
                        className="text-racing-red hover:text-red-700 transition"
                      >
                        <Car className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(comparison.id)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white shadow-sm">
              <p className="text-gray-500 mb-4">You haven't created any comparisons yet</p>
              <a 
                href="/inventory" 
                className="text-racing-red hover:text-red-700 transition"
              >
                Compare cars from our inventory
              </a>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ComparisonsPage;
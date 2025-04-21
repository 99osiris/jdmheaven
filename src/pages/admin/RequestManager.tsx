import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { RequestTable } from '../../components/admin/RequestTable';
import { SearchInput } from '../../components/admin/SearchInput';
import { FilterDropdown } from '../../components/admin/FilterDropdown';
import { AlertTriangle } from 'lucide-react';

const RequestManager = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select(`
          *,
          user:profiles(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load custom requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('custom_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;
      
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      console.error('Error updating request status:', err);
      alert('Failed to update request status');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.model && request.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      request.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-4xl font-zen mb-6">Custom Requests</h1>
          <p className="text-xl text-gray-300">Manage customer vehicle requests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by make, model, or email..."
            />
          </div>
          <div className="w-48">
            <FilterDropdown
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-none overflow-hidden">
            <RequestTable
              requests={filteredRequests}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestManager;
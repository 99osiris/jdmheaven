import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/Toast';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { CustomRequest } from '../../types';

export const RequestsWidget: React.FC = () => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await api.customRequests.getAll();
        setRequests(data.slice(0, 3)); // Show only 3 items in widget
      } catch (error) {
        console.error('Error loading requests:', error);
        toast.error('Failed to load custom requests');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-6">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No custom requests yet</p>
        <Link to="/custom-request" className="text-racing-red hover:text-red-700 text-sm mt-2 inline-block">
          Request a car
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="p-3 border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-zen text-sm">
              {request.make} {request.model}
            </h4>
            <span className={`text-xs px-2 py-1 ${
              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              request.status === 'approved' ? 'bg-green-100 text-green-800' :
              request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {request.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Requested {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      
      <div className="pt-2">
        <Link
          to="/custom-request"
          className="flex items-center text-racing-red hover:text-red-700 text-sm"
        >
          Create new request
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
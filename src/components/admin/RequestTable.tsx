import React from 'react';
import { StatusBadge } from './StatusBadge';

interface RequestTableProps {
  requests: Array<{
    id: string;
    make: string;
    model: string | null;
    status: string;
    created_at: string;
    user: {
      email: string;
      full_name: string | null;
    };
  }>;
  onStatusChange: (requestId: string, newStatus: string) => void;
}

export const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onStatusChange,
}) => {
  const getStatusType = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {request.user.full_name || 'No name'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.user.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {request.make} {request.model}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={request.status}
                  onChange={(e) => onStatusChange(request.id, e.target.value)}
                  className="text-sm rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
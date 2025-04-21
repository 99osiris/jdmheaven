import React from 'react';
import { StatusBadge } from './StatusBadge';

interface MessageTableProps {
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
    car_reference?: string | null;
  }>;
  onStatusChange: (messageId: string, newStatus: string) => void;
}

export const MessageTable: React.FC<MessageTableProps> = ({
  messages,
  onStatusChange,
}) => {
  const getStatusType = (status: string) => {
    switch (status) {
      case 'new':
        return 'warning';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'success';
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
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
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
          {messages.map((message) => (
            <tr key={message.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {message.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {message.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {message.subject}
                </div>
                {message.car_reference && (
                  <div className="text-xs text-gray-500">
                    Ref: {message.car_reference}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={message.status}
                  onChange={(e) => onStatusChange(message.id, e.target.value)}
                  className="text-sm rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(message.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
import React from 'react';
import { User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { toast } from '../../components/Toast';

interface UserTableProps {
  users: Array<{
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string;
  }>;
  onRoleChange: (userId: string, newRole: string) => void;
  onDeactivate: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onRoleChange,
  onDeactivate,
}) => {
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await onRoleChange(userId, newRole);
    } catch (error) {
      console.error('Error in role change:', error);
      toast.error('Failed to update role');
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
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'No name'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="text-sm rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onDeactivate(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
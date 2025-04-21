import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { UserTable } from '../../components/admin/UserTable';
import { SearchInput } from '../../components/admin/SearchInput';
import { AlertTriangle } from 'lucide-react';
import { toast } from '../../components/Toast';

const UserManager = () => {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (profileError) throw profileError;
      
      // Update user metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: newRole } }
      );

      if (authError) throw authError;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      // Refresh current user if they updated their own role
      if (userId === user?.id) {
        await refreshUser();
      }
      
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      // In a real application, you would:
      // 1. Disable the user's auth account
      // 2. Update their profile status
      // 3. Revoke their sessions
      
      // For this demo, we'll just show a success message
      toast.success('User deactivation would happen here');
      
      // Refresh the user list
      fetchUsers();
    } catch (err) {
      console.error('Error deactivating user:', err);
      toast.error('Failed to deactivate user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-4xl font-zen mb-6">User Management</h1>
          <p className="text-xl text-gray-300">Manage user accounts and permissions</p>
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

        <div className="mb-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users by email or name..."
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-none overflow-hidden">
            <UserTable
              users={filteredUsers}
              onRoleChange={handleRoleChange}
              onDeactivate={handleDeactivate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { MessageTable } from '../../components/admin/MessageTable';
import { SearchInput } from '../../components/admin/SearchInput';
import { FilterDropdown } from '../../components/admin/FilterDropdown';
import { AlertTriangle } from 'lucide-react';

const MessageManager = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
      alert('Failed to update message status');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;

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
          <h1 className="text-4xl font-zen mb-6">Contact Messages</h1>
          <p className="text-xl text-gray-300">Manage customer inquiries and messages</p>
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
              placeholder="Search by name, email, or subject..."
            />
          </div>
          <div className="w-48">
            <FilterDropdown
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'new', label: 'New' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-none overflow-hidden">
            <MessageTable
              messages={filteredMessages}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManager;
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from '../components/Toast';

interface UserDataContextType {
  downloadUserData: () => Promise<void>;
  requestAccountDeletion: () => Promise<boolean>;
  isProcessing: boolean;
}

const UserDataContext = createContext<UserDataContextType>({
  downloadUserData: async () => {},
  requestAccountDeletion: async () => false,
  isProcessing: false,
});

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Download user data in JSON format
  const downloadUserData = async () => {
    if (!user) {
      toast.error('You must be logged in to download your data');
      return;
    }

    setIsProcessing(true);

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch user's wishlist
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*, car:cars(*)')
        .eq('user_id', user.id);

      if (wishlistError) throw wishlistError;

      // Fetch user's comparisons
      const { data: comparisons, error: comparisonsError } = await supabase
        .from('car_comparisons')
        .select('*')
        .eq('user_id', user.id);

      if (comparisonsError) throw comparisonsError;

      // Fetch user's custom requests
      const { data: customRequests, error: requestsError } = await supabase
        .from('custom_requests')
        .select('*')
        .eq('user_id', user.id);

      if (requestsError) throw requestsError;

      // Fetch user's stock alerts
      const { data: stockAlerts, error: alertsError } = await supabase
        .from('stock_alerts')
        .select('*')
        .eq('user_id', user.id);

      if (alertsError) throw alertsError;

      // Compile all data
      const userData = {
        profile,
        wishlist,
        comparisons,
        customRequests,
        stockAlerts,
        exportDate: new Date().toISOString(),
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `jdm-heaven-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Your data has been downloaded');
    } catch (error) {
      console.error('Error downloading user data:', error);
      toast.error('Failed to download your data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Request account deletion
  const requestAccountDeletion = async (): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to delete your account');
      return false;
    }

    setIsProcessing(true);

    try {
      // Create a deletion request
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert([
          { 
            user_id: user.id,
            status: 'pending',
            requested_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      toast.success('Your account deletion request has been submitted. You will receive an email with further instructions.');
      return true;
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast.error('Failed to submit account deletion request. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        downloadUserData,
        requestAccountDeletion,
        isProcessing,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
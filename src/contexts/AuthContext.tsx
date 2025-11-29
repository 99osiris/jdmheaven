import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from '../components/Toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    // Test Supabase connection on startup
    const checkConnection = async () => {
      try {
        const { testSupabaseConnection } = await import('../lib/supabase');
        const status = await testSupabaseConnection();
        
        if (!status.configured) {
          console.warn('⚠️ Supabase is not configured. Authentication features will not work.');
        } else if (!status.connected) {
          console.warn('⚠️ Supabase connection failed:', status.error);
        } else {
          console.log('✅ Supabase connected successfully');
        }
      } catch (error) {
        console.warn('⚠️ Could not test Supabase connection:', error);
      }
    };

    checkConnection();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to get session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // If we have a user but no role in metadata, set default role
      if (currentUser && !currentUser.user_metadata.role) {
        try {
          await supabase.auth.updateUser({
            data: { role: 'user' }
          });
          
          // Refresh user to get updated metadata
          refreshUser();
        } catch (error) {
          console.error('Error updating user role:', error);
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Successfully signed out');
      // Use window.location for navigation to avoid router context issues
      if (typeof window !== 'undefined') {
        window.location.pathname = '/';
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
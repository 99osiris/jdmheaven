import { supabase } from '../supabase';
import { toast } from '../../components/Toast';
import { withErrorHandling, handleApiError } from '../../utils/errorHandler';

export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
}

export interface InventoryHistory {
  id: string;
  car_id: string;
  location_id?: string;
  created_by?: string;
  created_at: string;
  location?: { name: string };
  created_by_profile?: { full_name: string };
}

export interface StockAlert {
  id: string;
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_max?: number;
  is_active: boolean;
  created_at: string;
}

export const inventoryApi = {
  async getLocations(): Promise<Location[]> {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    }, 'Failed to fetch locations');
  },

  async getInventoryHistory(carId: string): Promise<InventoryHistory[]> {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('inventory_history')
        .select(`
          *,
          location:locations(name),
          created_by:profiles(full_name)
        `)
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'Failed to fetch inventory history');
  },

  async createStockAlert(alert: {
    make?: string;
    model?: string;
    year_min?: number;
    year_max?: number;
    price_max?: number;
  }): Promise<StockAlert> {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('stock_alerts')
        .insert(alert)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');
      return data;
    }, 'Failed to create stock alert');
  },

  async getStockAlerts(): Promise<StockAlert[]> {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('stock_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'Failed to fetch stock alerts');
  },

  async deleteStockAlert(id: string): Promise<void> {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('stock_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }, 'Failed to delete stock alert');
  },

  async toggleStockAlert(id: string, isActive: boolean): Promise<void> {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('stock_alerts')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    }, 'Failed to toggle stock alert');
  },

  subscribeToInventoryChanges(carId: string, callback: (payload: { new?: Location; old?: Location }) => void) {
    return supabase
      .channel(`car-${carId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cars',
          filter: `id=eq.${carId}`,
        },
        callback
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          toast.success('Watching inventory changes');
        }
      });
  },

  unsubscribeFromInventoryChanges(carId: string) {
    return supabase.removeChannel(`car-${carId}`);
  },
};
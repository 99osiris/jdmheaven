import { supabase } from '../supabase';
import { toast } from '../../components/Toast';

export const inventoryApi = {
  async getLocations() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async getInventoryHistory(carId: string) {
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
    return data;
  },

  async createStockAlert(alert: {
    make?: string;
    model?: string;
    year_min?: number;
    year_max?: number;
    price_max?: number;
  }) {
    const { data, error } = await supabase
      .from('stock_alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStockAlerts() {
    const { data, error } = await supabase
      .from('stock_alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteStockAlert(id: string) {
    const { error } = await supabase
      .from('stock_alerts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleStockAlert(id: string, isActive: boolean) {
    const { error } = await supabase
      .from('stock_alerts')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  },

  subscribeToInventoryChanges(carId: string, callback: (payload: any) => void) {
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
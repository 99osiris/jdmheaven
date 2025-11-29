import { supabase } from './supabase';
import type { Car, CarComparison, CustomRequest, WishlistItem } from '../types';

export const api = {
  cars: {
    getAll: async (): Promise<Car[]> => {
      // Fetch cars from Supabase (synced from Sanity)
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          images:car_images(id, url, is_primary),
          specs:car_specs(id, category, name, value)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cars from Supabase:', error);
        throw error;
      }

      return (data || []) as Car[];
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          images:car_images(id, url, is_primary),
          specs:car_specs(id, category, name, value)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Car;
    },
  },

  wishlist: {
    async getAll() {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          car:cars(*)
        `);

      if (error) throw error;
      return data as WishlistItem[];
    },

    async add(carId: string) {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({ car_id: carId })
        .select()
        .single();

      if (error) throw error;
      return data as WishlistItem;
    },

    async remove(id: string) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

  comparisons: {
    async getAll() {
      const { data, error } = await supabase
        .from('car_comparisons')
        .select('*');

      if (error) throw error;
      return data as CarComparison[];
    },

    async create(name: string, carIds: string[]) {
      const { data, error } = await supabase
        .from('car_comparisons')
        .insert({ 
          name, 
          cars: carIds,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as CarComparison;
    },

    async update(id: string, carIds: string[]) {
      const { data, error } = await supabase
        .from('car_comparisons')
        .update({ cars: carIds })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as CarComparison;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('car_comparisons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

  customRequests: {
    async create(request: Omit<CustomRequest, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('custom_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;
      return data as CustomRequest;
    },

    async getAll() {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*');

      if (error) throw error;
      return data as CustomRequest[];
    },
  },
};
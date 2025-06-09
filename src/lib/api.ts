import { supabase } from './supabase';
import type { Car, CarComparison, CustomRequest, WishlistItem } from '../types';

export const api = {
  cars: {
    getAll: async (): Promise<Car[]> => {
      // For now, return mock data
      return [
        {
          id: '1',
          reference_number: 'JDM001',
          make: 'Nissan',
          model: 'Skyline GT-R',
          year: 1999,
          price: 85000,
          engine_type: 'RB26DETT Twin-Turbo',
          horsepower: 280,
          images: [{ url: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80' }]
        },
        {
          id: '2',
          reference_number: 'JDM002',
          make: 'Toyota',
          model: 'Supra',
          year: 1994,
          price: 95000,
          engine_type: '2JZ-GTE Twin-Turbo',
          horsepower: 320,
          images: [{ url: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80' }]
        },
        {
          id: '3',
          reference_number: 'JDM003',
          make: 'Mazda',
          model: 'RX-7',
          year: 1992,
          price: 75000,
          engine_type: '13B-REW Twin-Rotor',
          horsepower: 280,
          images: [{ url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80' }]
        }
      ];
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
import { supabase } from '../supabase';
import { withErrorHandling } from '../../utils/errorHandler';

export interface CarImage {
  id: string;
  url: string;
  is_primary: boolean;
}

export interface CarSpec {
  id: string;
  category: string;
  name: string;
  value: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  engine_type?: string;
  engine_size?: string;
  transmission?: string;
  drivetrain?: string;
  horsepower?: number;
  torque?: number;
  color?: string;
  location?: string;
  status?: string;
  description?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  images?: CarImage[];
  specs?: CarSpec[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  author?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const cmsApi = {
  cars: {
    async getAll(): Promise<Car[]> {
      return withErrorHandling(async () => {
        const { data, error } = await supabase
          .from('cars')
          .select(`
            *,
            images:car_images(id, url, is_primary),
            specs:car_specs(id, category, name, value)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      }, 'Failed to fetch cars');
    },

    async create(car: Partial<Car>, images: CarImage[] = [], specs: CarSpec[] = []): Promise<Car> {
      try {
        // Ensure images and specs are properly formatted as arrays
        const imageData = Array.isArray(images) ? images : [];
        const specData = Array.isArray(specs) ? specs : [];
        
        const { data, error } = await supabase.rpc('create_car_with_details', {
          car_data: car,
          image_data: imageData,
          spec_data: specData
        });

        if (error) {
          console.error('RPC error:', error);
          throw new Error(`Failed to create car: ${error.message}`);
        }
        return data;
      } catch (error) {
        console.error('Error creating car:', error);
        throw new Error('Failed to create car');
      }
    },

    async update(car: Partial<Car> & { id: string }, images?: CarImage[], specs?: CarSpec[]): Promise<{ success: boolean }> {
      try {
        if (!car.id) {
          throw new Error('Car ID is required for updates');
        }

        // Update car details
        const { error: carError } = await supabase
          .from('cars')
          .update({
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            engine_type: car.engine_type,
            engine_size: car.engine_size,
            transmission: car.transmission,
            drivetrain: car.drivetrain,
            horsepower: car.horsepower,
            torque: car.torque,
            color: car.color,
            location: car.location,
            status: car.status,
            description: car.description,
            features: car.features,
            updated_at: new Date().toISOString()
          })
          .eq('id', car.id);

        if (carError) {
          console.error('Car update error:', carError);
          throw carError;
        }

        // Update images if provided
        if (images && images.length > 0) {
          // First delete existing images
          const { error: deleteError } = await supabase
            .from('car_images')
            .delete()
            .eq('car_id', car.id);
            
          if (deleteError) {
            console.error('Image delete error:', deleteError);
            throw deleteError;
          }
          
          // Then insert new images
          const imagesWithCarId = images.map(img => ({
            ...img,
            car_id: car.id
          }));
          
          const { error: imageError } = await supabase
            .from('car_images')
            .insert(imagesWithCarId);

          if (imageError) {
            console.error('Image insert error:', imageError);
            throw imageError;
          }
        }

        // Update specs if provided
        if (specs && specs.length > 0) {
          // First delete existing specs
          const { error: deleteSpecsError } = await supabase
            .from('car_specs')
            .delete()
            .eq('car_id', car.id);
            
          if (deleteSpecsError) {
            console.error('Specs delete error:', deleteSpecsError);
            throw deleteSpecsError;
          }
          
          // Then insert new specs
          const specsWithCarId = specs.map(spec => ({
            ...spec,
            car_id: car.id
          }));
          
          const { error: specError } = await supabase
            .from('car_specs')
            .insert(specsWithCarId);

          if (specError) {
            console.error('Specs insert error:', specError);
            throw specError;
          }
        }

        return { success: true };
      } catch (error) {
        console.error('Error updating car:', error);
        throw new Error('Failed to update car');
      }
    },

    async delete(id: string): Promise<{ success: boolean }> {
      return withErrorHandling(async () => {
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { success: true };
      }, 'Failed to delete car');
    },
  },

  blog: {
    async getAll(): Promise<BlogPost[]> {
      return withErrorHandling(async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      }, 'Failed to fetch blog posts');
    },

    async create(post: Partial<BlogPost>): Promise<BlogPost> {
      return withErrorHandling(async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(post)
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned');
        return data;
      }, 'Failed to create blog post');
    },

    async update(post: Partial<BlogPost> & { id: string }): Promise<BlogPost> {
      return withErrorHandling(async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(post)
          .eq('id', post.id)
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned');
        return data;
      }, 'Failed to update blog post');
    },

    async delete(id: string): Promise<{ success: boolean }> {
      return withErrorHandling(async () => {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { success: true };
      }, 'Failed to delete blog post');
    },
  },
};
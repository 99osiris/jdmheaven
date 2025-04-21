import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bell } from 'lucide-react';
import { inventoryApi } from '../lib/api/inventory';
import { toast } from './Toast';

const alertSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  year_min: z.string().optional(),
  year_max: z.string().optional(),
  price_max: z.string().optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

export const StockAlertForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
  });

  const onSubmit = async (data: AlertFormData) => {
    try {
      await inventoryApi.createStockAlert({
        make: data.make || undefined,
        model: data.model || undefined,
        year_min: data.year_min ? parseInt(data.year_min) : undefined,
        year_max: data.year_max ? parseInt(data.year_max) : undefined,
        price_max: data.price_max ? parseInt(data.price_max) : undefined,
      });

      toast.success('Stock alert created successfully');
      reset();
    } catch (error) {
      console.error('Error creating stock alert:', error);
      toast.error('Failed to create stock alert');
    }
  };

  return (
    <div className="bg-midnight p-6">
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-racing-red mr-2" />
        <h3 className="text-xl font-zen text-white">Create Stock Alert</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">Make</label>
          <input
            type="text"
            {...register('make')}
            placeholder="e.g., Nissan"
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">Model</label>
          <input
            type="text"
            {...register('model')}
            placeholder="e.g., Skyline GT-R"
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-zen text-gray-300 mb-2">Year From</label>
            <input
              type="number"
              {...register('year_min')}
              placeholder="Min year"
              className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-zen text-gray-300 mb-2">Year To</label>
            <input
              type="number"
              {...register('year_max')}
              placeholder="Max year"
              className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">Maximum Price (€)</label>
          <input
            type="number"
            {...register('price_max')}
            placeholder="Max price"
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Alert...' : 'Create Alert'}
        </button>
      </form>
    </div>
  );
};
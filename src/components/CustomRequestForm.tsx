import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../lib/api';

const schema = z.object({
  make: z.string().min(1, 'Maker is required'),
  model: z.string().optional(),
  year_min: z.number().min(1960).optional(),
  year_max: z.number().max(new Date().getFullYear()).optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().optional(),
  preferred_specs: z.array(z.string()).optional(),
  additional_notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const CustomRequestForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.customRequests.create(data);
      reset();
      alert('Your request has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('There was an error submitting your request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-zen text-gray-300 mb-2">
          Maker *
        </label>
        <input
          type="text"
          {...register('make')}
          className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
          placeholder="e.g., Nissan"
        />
        {errors.make && (
          <p className="mt-1 text-sm text-racing-red">{errors.make.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-zen text-gray-300 mb-2">
          Model
        </label>
        <input
          type="text"
          {...register('model')}
          className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
          placeholder="e.g., Skyline GT-R"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">
            Year (From)
          </label>
          <input
            type="number"
            {...register('year_min', { valueAsNumber: true })}
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
            placeholder="1960"
          />
        </div>
        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">
            Year (To)
          </label>
          <input
            type="number"
            {...register('year_max', { valueAsNumber: true })}
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
            placeholder="2025"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">
            Budget (From)
          </label>
          <input
            type="number"
            {...register('price_min', { valueAsNumber: true })}
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
            placeholder="Minimum €"
          />
        </div>
        <div>
          <label className="block text-sm font-zen text-gray-300 mb-2">
            Budget (To)
          </label>
          <input
            type="number"
            {...register('price_max', { valueAsNumber: true })}
            className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
            placeholder="Maximum €"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-zen text-gray-300 mb-2">
          Additional Notes
        </label>
        <textarea
          {...register('additional_notes')}
          rows={4}
          className="w-full bg-black/30 border border-gray-700 rounded-none p-2 text-white"
          placeholder="Any specific requirements or preferences..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-racing-red text-white py-3 font-zen hover:bg-red-700 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Save } from 'lucide-react';

const carSchema = z.object({
  id: z.string().uuid().optional(), // Add ID to schema
  reference_number: z.string().min(1, 'Reference number is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1960).max(new Date().getFullYear()),
  price: z.number().min(0),
  mileage: z.number().optional(),
  engine_type: z.string().optional(),
  engine_size: z.string().optional(),
  transmission: z.string().min(1, 'Transmission is required'),
  drivetrain: z.string().min(1, 'Drivetrain is required'),
  horsepower: z.number().optional(),
  torque: z.string().optional(),
  color: z.string().optional(),
  location: z.string().optional(),
  status: z.string().default('available'),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
});

const imageSchema = z.object({
  id: z.string().uuid().optional(),
  car_id: z.string().uuid().optional(),
  url: z.string().url('Must be a valid URL'),
  is_primary: z.boolean().default(false),
});

const specSchema = z.object({
  id: z.string().uuid().optional(),
  car_id: z.string().uuid().optional(),
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
});

type CarFormData = z.infer<typeof carSchema>;
type ImageData = z.infer<typeof imageSchema>;
type SpecData = z.infer<typeof specSchema>;

interface CarFormProps {
  onSubmit: (data: { car: CarFormData; images: ImageData[]; specs: SpecData[] }) => Promise<void>;
  initialData?: {
    car: CarFormData;
    images: ImageData[];
    specs: SpecData[];
  };
}

export const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData }) => {
  const [images, setImages] = React.useState<ImageData[]>(initialData?.images || []);
  const [specs, setSpecs] = React.useState<SpecData[]>(initialData?.specs || []);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData?.car,
  });

  // Generate reference number
  React.useEffect(() => {
    if (!initialData) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 5);
      const refNumber = `JDM-${timestamp}-${random}`.toUpperCase();
      setValue('reference_number', refNumber);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: CarFormData) => {
    setLoading(true);
    try {
      // Ensure ID is included if this is an update
      const carData = initialData?.car.id 
        ? { ...data, id: initialData.car.id }
        : data;
        
      // Prepare images with car_id if needed
      const preparedImages = images.map(img => {
        // For existing images, keep their IDs
        if (initialData?.car.id && !img.car_id) {
          return { ...img, car_id: initialData.car.id };
        }
        return img;
      });

      // Prepare specs with car_id if needed
      const preparedSpecs = specs.map(spec => {
        if (initialData?.car.id && !spec.car_id) {
          return { ...spec, car_id: initialData.car.id };
        }
        return spec;
      });

      await onSubmit({
        car: carData,
        images: preparedImages,
        specs: preparedSpecs,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    setImages([...images, { url: '', is_primary: false }]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof ImageData, value: string | boolean) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    
    // If setting this image as primary, unset others
    if (field === 'is_primary' && value === true) {
      newImages.forEach((img, i) => {
        if (i !== index) {
          newImages[i] = { ...newImages[i], is_primary: false };
        }
      });
    }
    
    setImages(newImages);
  };

  const addSpec = () => {
    setSpecs([...specs, { category: '', name: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: keyof SpecData, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <h3 className="text-xl font-zen text-gray-900 mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-zen text-gray-700">
              Reference Number *
            </label>
            <input
              type="text"
              {...register('reference_number')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red bg-gray-100"
              readOnly
            />
            {errors.reference_number && (
              <p className="mt-1 text-sm text-racing-red">{errors.reference_number.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Make *
            </label>
            <input
              type="text"
              {...register('make')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.make && (
              <p className="mt-1 text-sm text-racing-red">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Model *
            </label>
            <input
              type="text"
              {...register('model')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-racing-red">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Year *
            </label>
            <input
              type="number"
              {...register('year', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.year && (
              <p className="mt-1 text-sm text-racing-red">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Price *
            </label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-racing-red">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Status
            </label>
            <select
              {...register('status')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <h3 className="text-xl font-zen text-gray-900 mb-6">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-zen text-gray-700">
              Engine Type
            </label>
            <input
              type="text"
              {...register('engine_type')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Engine Size
            </label>
            <input
              type="text"
              {...register('engine_size')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Transmission *
            </label>
            <select
              {...register('transmission')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            >
              <option value="">Select transmission</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="semi-automatic">Semi-Automatic</option>
            </select>
            {errors.transmission && (
              <p className="mt-1 text-sm text-racing-red">{errors.transmission.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Drivetrain *
            </label>
            <select
              {...register('drivetrain')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            >
              <option value="">Select drivetrain</option>
              <option value="2WD">2WD</option>
              <option value="4WD">4WD</option>
              <option value="AWD">AWD</option>
              <option value="RWD">RWD</option>
              <option value="FWD">FWD</option>
            </select>
            {errors.drivetrain && (
              <p className="mt-1 text-sm text-racing-red">{errors.drivetrain.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Horsepower
            </label>
            <input
              type="number"
              {...register('horsepower', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Torque
            </label>
            <input
              type="text"
              {...register('torque')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <h3 className="text-xl font-zen text-gray-900 mb-6">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-zen text-gray-700">
              Mileage
            </label>
            <input
              type="number"
              {...register('mileage', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Color
            </label>
            <input
              type="text"
              {...register('color')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-zen text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
          ></textarea>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-zen text-gray-900">Images</h3>
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
          >
            <Plus size={16} className="mr-2" />
            Add Image
          </button>
        </div>

        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-4 bg-gray-50 p-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) => updateImage(index, 'url', e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                />
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={image.is_primary}
                  onChange={(e) => updateImage(index, 'is_primary', e.target.checked)}
                  className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
                />
                <span className="ml-2 text-sm text-gray-600">Primary</span>
              </label>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-gray-400 hover:text-racing-red transition"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-zen text-gray-900">Detailed Specifications</h3>
          <button
            type="button"
            onClick={addSpec}
            className="inline-flex items-center px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
          >
            <Plus size={16} className="mr-2" />
            Add Specification
          </button>
        </div>

        <div className="space-y-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-4 bg-gray-50 p-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={spec.category}
                  onChange={(e) => updateSpec(index, 'category', e.target.value)}
                  placeholder="Category"
                  className="w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => updateSpec(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="text-gray-400 hover:text-racing-red transition"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-racing-red text-white hover:bg-red-700 transition disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {loading ? 'Saving...' : 'Save Car'}
        </button>
      </div>
    </form>
  );
};
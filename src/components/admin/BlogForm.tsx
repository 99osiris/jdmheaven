import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  cover_image: z.string().url('Must be a valid URL').optional(),
  published: z.boolean().default(false),
  published_at: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => Promise<void>;
  initialData?: BlogFormData;
}

export const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, initialData }) => {
  const [loading, setLoading] = React.useState(false);
  const [tagInput, setTagInput] = React.useState('');
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      ...initialData,
      published_at: initialData?.published_at 
        ? new Date(initialData.published_at).toISOString().split('T')[0]
        : undefined,
    },
  });

  const published = watch('published');

  const handleFormSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      await onSubmit({
        ...data,
        tags,
        published_at: data.published ? new Date().toISOString() : null,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', generateSlug(value.title || ''));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <h3 className="text-xl font-zen text-gray-900 mb-6">Basic Information</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-zen text-gray-700">
              Title *
            </label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-racing-red">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              {...register('slug')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-racing-red">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Excerpt
            </label>
            <textarea
              {...register('excerpt')}
              rows={2}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Content *
            </label>
            <textarea
              {...register('content')}
              rows={10}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-racing-red">{errors.content.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Media & Categories */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <h3 className="text-xl font-zen text-gray-900 mb-6">Media & Categories</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-zen text-gray-700">
              Cover Image URL
            </label>
            <input
              type="url"
              {...register('cover_image')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            />
            {errors.cover_image && (
              <p className="mt-1 text-sm text-racing-red">{errors.cover_image.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Category
            </label>
            <select
              {...register('category')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
            >
              <option value="">Select a category</option>
              <option value="news">News</option>
              <option value="reviews">Reviews</option>
              <option value="guides">Guides</option>
              <option value="market-analysis">Market Analysis</option>
              <option value="events">Events</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-zen text-gray-700">
              Tags
            </label>
            <div className="mt-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-gray-500 hover:text-racing-red"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Type and press Enter to add tags"
                className="block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="bg-white p-6 shadow-lg rounded-none">
        <h3 className="text-xl font-zen text-gray-900 mb-6">Publishing Options</h3>
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('published')}
              className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Publish immediately
            </label>
          </div>

          {!published && (
            <div>
              <label className="block text-sm font-zen text-gray-700">
                Schedule Publication
              </label>
              <input
                type="date"
                {...register('published_at')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-racing-red text-white hover:bg-red-700 transition disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
};
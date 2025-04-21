import React, { useState } from 'react';
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

interface Image {
  id?: string;
  url: string;
  is_primary: boolean;
}

interface ImageManagerProps {
  images: Image[];
  onChange: (images: Image[]) => void;
  maxImages?: number;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  images,
  onChange,
  maxImages = 10,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addImage = () => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }
    onChange([...images, { url: '', is_primary: false }]);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof Image, value: string | boolean) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };

    if (field === 'is_primary' && value === true) {
      // Ensure only one primary image
      newImages.forEach((img, i) => {
        if (i !== index) {
          img.is_primary = false;
        }
      });
    }

    onChange(newImages);
  };

  const moveImage = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[fromIndex];
    newImages[fromIndex] = newImages[toIndex];
    newImages[toIndex] = temp;
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-zen text-gray-900">Images</h3>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex items-center px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
        >
          <Plus size={16} className="mr-2" />
          Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="relative bg-gray-50 p-4 border border-gray-200 hover:border-racing-red transition cursor-move"
          >
            {image.url && (
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover mb-4"
              />
            )}

            <div className="space-y-2">
              <input
                type="url"
                value={image.url}
                onChange={(e) => updateImage(index, 'url', e.target.value)}
                placeholder="Image URL"
                className="w-full text-sm rounded-none border-gray-300 shadow-sm focus:border-racing-red focus:ring-racing-red"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={image.is_primary}
                    onChange={(e) => updateImage(index, 'is_primary', e.target.checked)}
                    className="rounded-none border-gray-300 text-racing-red focus:ring-racing-red"
                  />
                  <span className="ml-2 text-sm text-gray-600">Primary</span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-racing-red transition disabled:opacity-50"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="text-gray-400 hover:text-racing-red transition disabled:opacity-50"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-gray-400 hover:text-racing-red transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No images added yet</p>
          <button
            type="button"
            onClick={addImage}
            className="mt-2 text-racing-red hover:text-red-700 transition"
          >
            Add your first image
          </button>
        </div>
      )}
    </div>
  );
};
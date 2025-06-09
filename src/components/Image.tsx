import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | 'auto';
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallback = '/images/placeholder.jpg',
  className = '',
  aspectRatio = 'auto',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    'auto': ''
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {/* Main Image */}
      <img
        src={error ? fallback : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <ImageOff className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};
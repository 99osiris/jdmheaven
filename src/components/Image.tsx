import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  // Handle image load error
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${error ? 'hidden' : ''}`}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { urlFor } from '../lib/sanity-client';
import { Image } from './Image';
import { generateBlurDataUrl } from '../utils/imageOptimization';

interface SanityImageProps {
  image: any;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const SanityImage: React.FC<SanityImageProps> = ({
  image,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
}) => {
  const [blurDataUrl, setBlurDataUrl] = useState<string>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadBlurImage = async () => {
      try {
        if (image) {
          const imageUrl = typeof image === 'string' ? image : urlFor(image).width(100).url();
          const dataUrl = await generateBlurDataUrl(imageUrl);
          setBlurDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('Error generating blur data URL:', err);
      }
    };

    loadBlurImage();
  }, [image]);

  if (!image || error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  // Generate optimized image URL
  let imageUrl = '';
  try {
    imageUrl = typeof image === 'string' 
      ? image 
      : urlFor(image)
          .auto('format')
          .fit('max')
          .quality(80)
          .url();
    
    // Add width if specified
    if (width) {
      imageUrl = typeof image === 'string'
        ? image
        : urlFor(image).width(width).url();
    }
    
    // Add height if specified
    if (height) {
      imageUrl = typeof image === 'string'
        ? image
        : urlFor(image).height(height).url();
    }
  } catch (err) {
    console.error('Error generating Sanity image URL:', err);
    setError(true);
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image error</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      blurDataUrl={blurDataUrl}
      onError={() => setError(true)}
    />
  );
};
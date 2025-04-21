import React from 'react';
import { urlFor } from '../../lib/sanity';
import { Image } from '../Image';

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
  if (!image) {
    return <div className={`bg-gray-200 ${className}`} />;
  }

  // Generate optimized image URL with Sanity's image URL builder
  const imageUrl = urlFor(image)
    .auto('format')
    .fit('max')
    .quality(80);
  
  // Add width if specified
  if (width) {
    imageUrl.width(width);
  }
  
  // Add height if specified
  if (height) {
    imageUrl.height(height);
  }

  return (
    <Image
      src={imageUrl.url()}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
};
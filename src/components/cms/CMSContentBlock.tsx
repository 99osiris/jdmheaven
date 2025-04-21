import React, { useState, useEffect } from 'react';
import { sanityClient } from '../../lib/sanity';
import { PortableText } from './PortableText';
import { SanityImage } from './SanityImage';

interface CMSContentBlockProps {
  contentId: string;
  fallback?: React.ReactNode;
}

export const CMSContentBlock: React.FC<CMSContentBlockProps> = ({ contentId, fallback }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_id == $contentId][0]`,
          { contentId }
        );
        setContent(data);
      } catch (err) {
        console.error(`Error fetching content block ${contentId}:`, err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 w-full mb-2"></div>
        <div className="h-4 bg-gray-200 w-full mb-2"></div>
        <div className="h-4 bg-gray-200 w-2/3"></div>
      </div>
    );
  }

  if (error || !content) {
    return fallback ? <>{fallback}</> : null;
  }

  // Render based on content type
  if (content._type === 'textBlock') {
    return (
      <div className="cms-text-block">
        {content.title && <h2 className="text-2xl font-zen mb-4">{content.title}</h2>}
        <PortableText content={content.body} />
      </div>
    );
  }

  if (content._type === 'imageWithText') {
    return (
      <div className="cms-image-text grid md:grid-cols-2 gap-8 items-center">
        <div className={content.imagePosition === 'right' ? 'order-1 md:order-2' : ''}>
          <SanityImage
            image={content.image}
            alt={content.title || ''}
            className="w-full h-auto"
          />
        </div>
        <div className={content.imagePosition === 'right' ? 'order-2 md:order-1' : ''}>
          {content.title && <h2 className="text-2xl font-zen mb-4">{content.title}</h2>}
          <PortableText content={content.body} />
        </div>
      </div>
    );
  }

  if (content._type === 'callToAction') {
    return (
      <div className="cms-cta bg-midnight text-white p-8 text-center">
        {content.title && <h2 className="text-2xl font-zen mb-4">{content.title}</h2>}
        {content.subtitle && <p className="text-lg mb-6">{content.subtitle}</p>}
        <a
          href={content.buttonLink}
          className="inline-block bg-racing-red text-white px-8 py-3 font-zen hover:bg-red-700 transition"
        >
          {content.buttonText}
        </a>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="cms-content">
      {content.title && <h2 className="text-2xl font-zen mb-4">{content.title}</h2>}
      {content.body && <PortableText content={content.body} />}
    </div>
  );
};
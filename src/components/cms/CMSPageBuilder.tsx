import React, { useState, useEffect } from 'react';
import { sanityClient } from '../../lib/sanity';
import { PortableText } from './PortableText';
import { SanityImage } from './SanityImage';
import { Gallery } from './Gallery';
import { TestimonialCarousel } from './TestimonialCarousel';
import { FeaturedCarsFromCMS } from './FeaturedCarsFromCMS';
import { JdmLegendsFromCMS } from './JdmLegendsFromCMS';
import { ServicesFromCMS } from './ServicesFromCMS';

interface CMSPageBuilderProps {
  pageId: string;
  fallback?: React.ReactNode;
}

export const CMSPageBuilder: React.FC<CMSPageBuilderProps> = ({ pageId, fallback }) => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_id == $pageId][0]{
            title,
            description,
            "sections": sections[] {
              _type == "reference" => @->,
              ...
            }
          }`,
          { pageId }
        );
        setPageData(data);
      } catch (err) {
        console.error(`Error fetching page ${pageId}:`, err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-12">
        <div className="h-12 bg-gray-200 w-1/2 mx-auto"></div>
        <div className="h-64 bg-gray-200"></div>
        <div className="h-64 bg-gray-200"></div>
        <div className="h-64 bg-gray-200"></div>
      </div>
    );
  }

  if (error || !pageData) {
    return fallback ? <>{fallback}</> : null;
  }

  // Render each section based on its type
  const renderSection = (section: any, index: number) => {
    if (!section) return null;

    switch (section._type) {
      case 'textBlock':
        return (
          <section key={section._key || index} className="py-12">
            <div className="max-w-4xl mx-auto px-4">
              {section.title && <h2 className="text-3xl font-zen mb-6">{section.title}</h2>}
              <PortableText content={section.body} />
            </div>
          </section>
        );

      case 'imageWithText':
        return (
          <section key={section._key || index} className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className={section.imagePosition === 'right' ? 'order-1 md:order-2' : ''}>
                  <SanityImage
                    image={section.image}
                    alt={section.title || ''}
                    className="w-full h-auto"
                  />
                </div>
                <div className={section.imagePosition === 'right' ? 'order-2 md:order-1' : ''}>
                  {section.title && <h2 className="text-3xl font-zen mb-6">{section.title}</h2>}
                  <PortableText content={section.body} />
                </div>
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={section._key || index} className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              {section.title && (
                <h2 className="text-3xl font-zen mb-8 text-center">{section.title}</h2>
              )}
              <Gallery category={section.category} columns={section.columns || 3} limit={section.limit || 12} />
            </div>
          </section>
        );

      case 'testimonials':
        return <TestimonialCarousel key={section._key || index} />;

      case 'featuredCars':
        return <FeaturedCarsFromCMS key={section._key || index} />;

      case 'jdmLegends':
        return <JdmLegendsFromCMS key={section._key || index} />;

      case 'services':
        return <ServicesFromCMS key={section._key || index} />;

      case 'callToAction':
        return (
          <section key={section._key || index} className="py-12 bg-midnight text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              {section.title && <h2 className="text-3xl font-zen mb-4">{section.title}</h2>}
              {section.subtitle && <p className="text-xl text-gray-300 mb-8">{section.subtitle}</p>}
              <a
                href={section.buttonLink}
                className="inline-block bg-racing-red text-white px-8 py-3 font-zen hover:bg-red-700 transition"
              >
                {section.buttonText}
              </a>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cms-page">
      {pageData.sections?.map(renderSection)}
    </div>
  );
};
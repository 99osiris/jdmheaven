import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CMSPageBuilder } from '../components/cms/CMSPageBuilder';
import { sanityClient } from '../lib/sanity';

const CMSPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_type == "page" && slug.current == $slug][0]{
            title,
            description,
            "mainImage": mainImage.asset->url,
            _id
          }`,
          { slug }
        );
        setPageData(data);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-12 bg-gray-200 w-1/3 mb-8"></div>
            <div className="h-6 bg-gray-200 w-full mb-4"></div>
            <div className="h-6 bg-gray-200 w-full mb-4"></div>
            <div className="h-6 bg-gray-200 w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-zen mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={pageData.title}
        description={pageData.description}
        image={pageData.mainImage}
      />

      <div className="pt-20">
        <div className="bg-midnight text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-zen mb-6">{pageData.title}</h1>
            {pageData.description && (
              <p className="text-xl text-gray-300">{pageData.description}</p>
            )}
          </div>
        </div>

        <CMSPageBuilder
          pageId={pageData._id}
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <p className="text-gray-600">Content is being updated. Please check back later.</p>
            </div>
          }
        />
      </div>
    </>
  );
};

export default CMSPage;
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Thing, WithContext } from 'schema-dts';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  schema?: WithContext<Thing>;
  canonical?: string;
  type?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = '/logo.png',
  schema,
  canonical = 'https://jdmheaven.com',
  type = 'website',
}) => {
  const siteTitle = 'JDM HEAVEN';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
import React from 'react';
import { PortableText as SanityPortableText } from 'react-portable-text';
import { SanityImage } from '../SanityImage';

interface PortableTextProps {
  content: any;
  className?: string;
}

export const PortableText: React.FC<PortableTextProps> = ({ content, className = '' }) => {
  if (!content) {
    return null;
  }

  return (
    <div className={`prose max-w-none ${className}`}>
      <SanityPortableText
        dataset={import.meta.env.VITE_SANITY_DATASET || 'production'}
        projectId={import.meta.env.VITE_SANITY_PROJECT_ID || 'aoh6qdxm'}
        content={content}
        serializers={{
          h1: (props: any) => <h1 className="text-3xl font-zen mb-4" {...props} />,
          h2: (props: any) => <h2 className="text-2xl font-zen mb-3" {...props} />,
          h3: (props: any) => <h3 className="text-xl font-zen mb-3" {...props} />,
          h4: (props: any) => <h4 className="text-lg font-zen mb-2" {...props} />,
          normal: (props: any) => <p className="mb-4 text-gray-700" {...props} />,
          blockquote: (props: any) => (
            <blockquote className="border-l-4 border-racing-red pl-4 italic my-6" {...props} />
          ),
          ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: (props: any) => <li className="mb-1" {...props} />,
          link: ({ href, children }: any) => (
            <a href={href} className="text-racing-red hover:text-red-700 transition">
              {children}
            </a>
          ),
          image: ({ asset }: any) => (
            <div className="my-8">
              <SanityImage
                image={asset}
                alt=""
                className="w-full h-auto rounded-none"
              />
            </div>
          ),
        }}
      />
    </div>
  );
};
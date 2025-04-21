import React from 'react';
import { format } from 'date-fns';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SanityImage } from '../SanityImage';
import { PortableText } from './PortableText';

interface BlogPostDetailProps {
  post: any;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const navigate = useNavigate();

  if (!post) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/blog')}
        className="flex items-center text-gray-600 hover:text-racing-red mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Blog
      </button>

      {post.mainImage && (
        <div className="mb-8">
          <SanityImage
            image={post.mainImage}
            alt={post.title}
            className="w-full h-96 object-cover"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl font-zen text-midnight mb-6">{post.title}</h1>

      <div className="flex items-center space-x-6 text-gray-600 mb-8">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
          </time>
        </div>
        
        {post.author && (
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <div className="flex items-center">
              {post.author.image && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <SanityImage
                    image={post.author.image}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <span>{post.author.name}</span>
            </div>
          </div>
        )}
        
        {post.categories && post.categories.length > 0 && (
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            <span>{post.categories.join(', ')}</span>
          </div>
        )}
      </div>

      <PortableText content={post.body} className="mb-16" />

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mb-16">
          <h2 className="text-2xl font-zen mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {post.relatedPosts.map((relatedPost: any) => (
              <Link
                key={relatedPost._id}
                to={`/blog/${relatedPost.slug.current}`}
                className="group"
              >
                <div className="h-40 overflow-hidden mb-3">
                  <SanityImage
                    image={relatedPost.mainImage}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-zen text-lg group-hover:text-racing-red transition">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(relatedPost.publishedAt), 'MMMM d, yyyy')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
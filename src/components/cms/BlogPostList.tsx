import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, ArrowRight, RefreshCw } from 'lucide-react';
import { cms } from '../../lib/cms';
import { SanityImage } from '../SanityImage';
import { motion } from 'framer-motion';

interface BlogPostListProps {
  limit?: number;
  showPagination?: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage: string;
  publishedAt: string;
  categories: string[];
  author: {
    name: string;
    image: string;
  };
}

export const BlogPostList: React.FC<BlogPostListProps> = ({
  limit = 9,
  showPagination = true,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const postsPerPage = limit;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const data = await cms.getBlogPosts(postsPerPage, (page - 1) * postsPerPage);
          setPosts(data.posts || []);
          setTotalPosts(data.total || 0);
        } catch (err: any) {
          console.error('Error loading blog posts:', err);
          setError(err.error || 'Failed to load blog posts');
          
          // Use fallback data
          setPosts(getFallbackPosts());
          setTotalPosts(getFallbackPosts().length);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page, postsPerPage, retryCount]);

  const getFallbackPosts = (): BlogPost[] => {
    return [
      {
        _id: '1',
        title: 'The Rise of JDM Culture in Europe',
        slug: { current: 'rise-of-jdm-culture-europe' },
        excerpt: 'How Japanese performance cars became a cultural phenomenon across European car enthusiasts.',
        mainImage: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80',
        publishedAt: new Date().toISOString(),
        categories: ['Culture', 'Trends'],
        author: {
          name: 'JDM HEAVEN Team',
          image: ''
        }
      },
      {
        _id: '2',
        title: 'Buyer\'s Guide: R34 Skyline GT-R',
        slug: { current: 'buyers-guide-r34-skyline-gtr' },
        excerpt: 'Everything you need to know before purchasing the legendary Nissan Skyline R34 GT-R.',
        mainImage: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        categories: ['Guides', 'Nissan'],
        author: {
          name: 'JDM HEAVEN Team',
          image: ''
        }
      },
      {
        _id: '3',
        title: 'Maintaining Your Rotary Engine: RX-7 Care Tips',
        slug: { current: 'maintaining-rotary-engine-rx7-care-tips' },
        excerpt: 'Essential maintenance tips to keep your Mazda RX-7\'s rotary engine running smoothly.',
        mainImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        categories: ['Maintenance', 'Mazda'],
        author: {
          name: 'JDM HEAVEN Team',
          image: ''
        }
      }
    ];
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 mb-4"></div>
            <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200 mb-4"></div>
            <div className="h-8 bg-gray-200 w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0 && error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 p-6 rounded-none inline-block">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-gray-500 text-center py-8">No blog posts found</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} - Showing fallback content.
              </p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm text-racing-red hover:text-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white shadow-lg"
          >
            {post.mainImage && (
              <Link to={`/blog/${post.slug.current}`} className="block">
                <div className="h-48 overflow-hidden">
                  <SanityImage
                    image={post.mainImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>
            )}
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                <time dateTime={post.publishedAt}>
                  {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                </time>
                <span className="mx-2">•</span>
                <User className="w-4 h-4 mr-1" />
                <span>{post.author?.name || 'JDM HEAVEN'}</span>
              </div>

              <h2 className="text-xl font-zen text-midnight mb-3">
                <Link to={`/blog/${post.slug.current}`} className="hover:text-racing-red transition">
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              )}

              <Link
                to={`/blog/${post.slug.current}`}
                className="inline-flex items-center text-racing-red hover:text-red-700 transition font-zen"
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 ${
                page === i + 1
                  ? 'bg-racing-red text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
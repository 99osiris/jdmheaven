import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../components/Toast';
import type { BlogPost } from '../types';

const POSTS_PER_PAGE = 9;

const BlogPage = () => {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(0);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      if (error) throw error;

      setPosts(prev => [...prev, ...(data || [])]);
      setHasMore((data || []).length === POSTS_PER_PAGE);
      setPage(p => p + 1);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <SEO
        title="Blog | JDM HEAVEN"
        description="Latest news, guides, and stories from the world of Japanese performance cars"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'JDM HEAVEN Blog',
          description: 'Latest news, guides, and stories from the world of Japanese performance cars',
        }}
      />

      <div className="pt-20">
        <div className="bg-midnight text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-zen mb-6">JDM Insights</h1>
            <p className="text-xl text-gray-300">Latest news, guides, and stories from the world of Japanese performance cars</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <InfiniteScroll
            onLoadMore={loadPosts}
            hasMore={hasMore}
            loading={loading}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white shadow-lg">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={post.published_at || post.created_at}>
                        {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                      </time>
                      <span className="mx-2">•</span>
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author?.full_name || 'JDM HEAVEN'}</span>
                    </div>

                    <h2 className="text-xl font-zen text-midnight mb-3">
                      <Link to={`/blog/${post.slug}`} className="hover:text-racing-red transition">
                        {post.title}
                      </Link>
                    </h2>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-racing-red hover:text-red-700 transition font-zen"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </InfiniteScroll>

          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
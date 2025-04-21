import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { SEO } from '../components/SEO';
import { Comments } from '../components/Comments';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from '../components/Toast';
import { BlogPost } from '../types';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles(full_name, avatar_url)
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load blog post');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 w-3/4"></div>
            <div className="h-4 bg-gray-200 w-1/4"></div>
            <div className="h-64 bg-gray-200"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200"></div>
              <div className="h-4 bg-gray-200"></div>
              <div className="h-4 bg-gray-200 w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt || ''}
        image={post.cover_image || undefined}
        type="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          image: post.cover_image || undefined,
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at,
          author: {
            '@type': 'Person',
            name: post.author?.full_name || 'JDM HEAVEN',
          },
        }}
      />

      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center text-gray-600 hover:text-racing-red mb-8 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </button>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-96 object-cover mb-8"
            />
          )}

          <h1 className="text-4xl font-zen text-midnight mb-6">{post.title}</h1>

          <div className="flex items-center space-x-6 text-gray-600 mb-8">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <time dateTime={post.published_at || post.created_at}>
                {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {post.author?.full_name || 'JDM HEAVEN'}
            </div>
            {post.category && (
              <div className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                {post.category}
              </div>
            )}
          </div>

          {post.excerpt && (
            <div className="bg-gray-50 p-6 mb-8 text-lg text-gray-700 italic">
              {post.excerpt}
            </div>
          )}

          <div className="prose max-w-none mb-16">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-gray-200 pt-8 mb-16">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-gray-600">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Comments postId={post.id} />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
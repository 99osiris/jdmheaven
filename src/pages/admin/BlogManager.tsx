import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cmsApi } from '../../lib/api/cms';
import { BlogForm } from '../../components/admin/BlogForm';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  tags: string[];
  category: string | null;
  created_at: string;
  updated_at: string;
}

const BlogManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await cmsApi.blog.getAll();
      setPosts(data);
    } catch (err) {
      console.error('Error loading blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingPost) {
        await cmsApi.blog.update({ ...data, id: editingPost.id });
      } else {
        await cmsApi.blog.create(data);
      }
      setShowForm(false);
      setEditingPost(null);
      loadPosts();
    } catch (err) {
      console.error('Error saving blog post:', err);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await cmsApi.blog.delete(id);
      loadPosts();
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('Failed to delete blog post. Please try again.');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await cmsApi.blog.update({
        ...post,
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : null,
      });
      loadPosts();
    } catch (err) {
      console.error('Error updating blog post:', err);
      alert('Failed to update blog post. Please try again.');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if user has admin role
  if (user?.user_metadata?.role !== 'admin') {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">Unauthorized. Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-zen">Blog Manager</h1>
            <button
              onClick={() => {
                setEditingPost(null);
                setShowForm(true);
              }}
              className="bg-racing-red text-white px-6 py-3 rounded-none hover:bg-red-700 transition flex items-center"
            >
              <Plus className="mr-2" />
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showForm ? (
          <div className="mb-8">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingPost(null);
              }}
              className="mb-4 text-gray-600 hover:text-racing-red transition"
            >
              ← Back to List
            </button>
            <BlogForm
              onSubmit={handleSubmit}
              initialData={editingPost || undefined}
            />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, category, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pl-12 bg-gray-100 rounded-none"
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading blog posts...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-none overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Published Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.category || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className="text-gray-400 hover:text-gray-600 mr-4"
                            title={post.published ? 'Unpublish' : 'Publish'}
                          >
                            {post.published ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              setShowForm(true);
                            }}
                            className="text-racing-red hover:text-red-700 mr-4"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogManager;
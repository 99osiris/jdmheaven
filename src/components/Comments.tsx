import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { toast } from './Toast';
import { MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    full_name: string;
    avatar_url?: string;
  };
}

interface CommentsProps {
  postId: string;
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          id,
          content,
          created_at,
          user:profiles(full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadComments();
  }, [postId]);

  const onSubmit = async (data: { content: string }) => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          content: data.content,
          user_id: user.id,
        });

      if (error) throw error;

      toast.success('Comment added successfully');
      reset();
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-none mb-4"></div>
        <div className="h-20 bg-gray-200 rounded-none"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-zen flex items-center">
        <MessageSquare className="w-6 h-6 mr-2" />
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register('content', { required: true })}
            placeholder="Add a comment..."
            className="w-full p-4 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
            rows={4}
          />
          <button
            type="submit"
            className="bg-racing-red text-white px-6 py-2 rounded-none hover:bg-red-700 transition"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-600">
            Please{' '}
            <a href="/auth" className="text-racing-red hover:text-red-700">
              sign in
            </a>{' '}
            to comment
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {comment.user.avatar_url ? (
                  <img
                    src={comment.user.avatar_url}
                    alt={comment.user.full_name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-gray-500 text-xl">
                    {comment.user.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-zen">{comment.user.full_name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};
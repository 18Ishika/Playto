import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const PostCard = ({ post, isLoading, user, onCommentSuccess, onLikeSuccess, isDetailView = false }) => {
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [isLiked, setIsLiked] = useState(post?.is_liked_by_user || false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    setLikesCount(post?.likes_count || 0);
    setIsLiked(post?.is_liked_by_user || false);
  }, [post]);

  const handleLike = async (e) => {
    e.stopPropagation(); 
    if (!user || isProcessing || !post?.id || String(post.id).startsWith('d')) return;
    setIsProcessing(true);
    const previouslyLiked = isLiked;
    setIsLiked(!previouslyLiked);
    setLikesCount(prev => previouslyLiked ? prev - 1 : prev + 1);

    try {
      const response = await api.post(`/posts/${post.id}/like/`);
      setLikesCount(response.data.likes_count);
      setIsLiked(response.data.is_liked_by_user);
      if (onLikeSuccess) onLikeSuccess();
    } catch (err) {
      setIsLiked(previouslyLiked);
      setLikesCount(prev => previouslyLiked ? prev + 1 : prev - 1);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="w-full border border-gray-100 dark:border-gray-800 p-4 rounded-xl animate-pulse bg-white dark:bg-gray-900 h-24" />;

  return (
    <div className={`w-full transition-all bg-white dark:bg-gray-900 ${
      isDetailView 
        ? 'border-b border-gray-100 dark:border-gray-800 py-3 px-1' 
        : 'border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm mb-4'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex space-x-3 w-full">
          {/* Smaller avatars for replies in discussion */}
          <div className={`${isDetailView ? 'h-8 w-8 text-[10px]' : 'h-10 w-10'} rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0`}>
            {post?.author?.username?.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`font-semibold text-gray-900 dark:text-white truncate ${isDetailView ? 'text-xs' : 'text-sm'}`}>
                {post?.author?.username}
              </span>
              <span className="text-[10px] text-gray-400">
                {post?.created_at ? new Date(post.created_at).toLocaleDateString() : "Just now"}
              </span>
            </div>
            <p className={`mt-1 text-gray-700 dark:text-gray-300 leading-relaxed break-words ${isDetailView ? 'text-sm' : 'text-base'}`}>
              {post?.content}
            </p>

            {/* Actions Row */}
            <div className="flex items-center space-x-5 mt-2 text-gray-400">
              {/* Like Button */}
              <button onClick={handleLike} className={`flex items-center space-x-1.5 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                <Heart size={isDetailView ? 14 : 16} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-xs">{likesCount}</span>
              </button>

              {/* Reply Button with Dynamic Count */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsReplying(!isReplying); }}
                className={`flex items-center space-x-1.5 hover:text-blue-500 transition-colors ${isReplying ? 'text-blue-500' : ''}`}
              >
                <MessageCircle size={isDetailView ? 14 : 16} />
                <span className="text-xs font-medium">
                  {post?.replies_count ?? 0}
                </span>
                {!isDetailView && <span className="text-xs">Replies</span>}
              </button>

              {/* "View Thread" text ONLY on main feed */}
              {!isDetailView && (
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
                  className="text-[10px] font-bold uppercase tracking-tight hover:text-green-500 transition-colors"
                >
                  View Thread
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Directing Arrow Icon ONLY on main feed */}
        {!isDetailView && (
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
            className="text-gray-300 hover:text-blue-500 p-1"
          >
            <ExternalLink size={16} />
          </button>
        )}
      </div>

      {isReplying && (
        <div className="mt-3 ml-11" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!replyContent.trim()) return;
            setIsSubmittingReply(true);
            try {
              const res = await api.post('/posts/create/', { content: replyContent, parent: post.id });
              setReplyContent("");
              setIsReplying(false);
              if (onCommentSuccess) onCommentSuccess(res.data);
            } catch (err) { console.error(err); } finally { setIsSubmittingReply(false); }
          }} className="relative">
            <textarea
              autoFocus
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:ring-1 focus:ring-blue-400 resize-none"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button disabled={isSubmittingReply} className="absolute right-2 bottom-2 text-blue-500 disabled:opacity-50">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
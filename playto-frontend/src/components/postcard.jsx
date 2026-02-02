import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post, isLoading }) => {
  // 1. DUMMY STATE (Skeleton Loader)
  if (isLoading) {
    return (
      <div className="max-w-xl w-full border border-gray-200 dark:border-gray-800 p-4 rounded-xl animate-pulse bg-white dark:bg-gray-900">
        <div className="flex space-x-3">
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTUAL DATA STATE
  return (
    <div className="max-w-xl w-full border border-gray-200 dark:border-gray-800 p-4 rounded-xl bg-white dark:bg-gray-900 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex space-x-3">
          {/* User Profile Logo (Initials or Placeholder) */}
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
            {post.author?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
                {post.author?.username}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {/* Post Content */}
            <p className="mt-2 text-gray-800 dark:text-gray-200 leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 ml-12 max-w-xs text-gray-500">
        <button className="flex items-center space-x-2 hover:text-pink-500 transition-colors">
          <Heart size={18} />
          <span className="text-sm">Like</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <MessageCircle size={18} />
          <span className="text-sm">Comment</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
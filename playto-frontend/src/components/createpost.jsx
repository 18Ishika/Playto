import React, { useState } from 'react';
import api from '../api';
import { X } from "lucide-react";

const CreatePost = ({ onPostCreated, onClose }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.post('/posts/create/', { content });
      onPostCreated(res.data);
      onClose(); 
    } catch (err) {
      console.error("Error creating post", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Fixed: Use z-50 instead of z-[10000] for proper Tailwind layering
    // Added pointer-events-none to backdrop, pointer-events-auto to modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
      
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-gray-200 dark:border-gray-800 pointer-events-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
             <h2 className="text-2xl font-black dark:text-white tracking-tight">New Post</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
          >
            <X size={24} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            autoFocus
            className="w-full h-48 bg-gray-50 dark:bg-gray-800 dark:text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 transition-all resize-none text-lg"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
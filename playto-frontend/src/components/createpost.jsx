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
    // The "fixed inset-0" ensures it covers the whole screen regardless of where it's called
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header with Cross Option */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">New Post</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            autoFocus
            className="w-full h-40 bg-gray-50 dark:bg-gray-800 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 transition-all resize-none"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex justify-end gap-3 mt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
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
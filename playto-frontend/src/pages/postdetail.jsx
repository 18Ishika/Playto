import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/navbar";
import PostCard from "../components/postcard";
import api from "../api";

function PostDetail({ darkMode, setDarkMode, user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThread = async () => {
    try {
      const res = await api.get(`/posts/postdetail/${id}/`);
      setPost(res.data);
    } catch (err) {
      console.error("Error fetching thread:", err);
      setError("Post not found.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  if (isLoading) return <div className="min-h-screen dark:bg-black p-20 text-center dark:text-white">Loading Thread...</div>;
  if (error) return <div className="min-h-screen dark:bg-black p-20 text-center dark:text-white">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} setUser={setUser} />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Feed</span>
        </button>

        {/* The Main Post (Top of the thread) */}
        <div className="mb-10">
          <PostCard 
            post={post} 
            user={user} 
            isLoading={false} 
            isDetailView={true} // Hides redundant buttons
            onCommentSuccess={fetchThread} 
            onLikeSuccess={fetchThread}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>Discussion</span>
            <span className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs text-gray-500">
              {post.replies?.length || 0}
            </span>
          </h2>
          
          {post.replies && post.replies.length > 0 ? (
            <div className="space-y-6 border-l border-gray-200 dark:border-gray-800 ml-2 pl-4">
               {post.replies.map((reply) => (
                 <RecursivePost key={reply.id} post={reply} user={user} refresh={fetchThread} />
               ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-gray-500 text-sm">No replies yet. Be the first to break the silence!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper component to handle recursive nesting
const RecursivePost = ({ post, user, refresh }) => {
  return (
    <div className="space-y-4">
      <PostCard 
        post={post} 
        user={user} 
        isLoading={false} 
        isDetailView={true} // Hides redundant buttons in replies
        onCommentSuccess={refresh} 
        onLikeSuccess={refresh}
      />
      
      {post.replies && post.replies.length > 0 && (
        <div className="border-l border-gray-200 dark:border-gray-800 ml-3 pl-4 space-y-4">
          {post.replies.map((child) => (
            <RecursivePost key={child.id} post={child} user={user} refresh={refresh} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetail;
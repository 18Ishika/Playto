import { useState, useEffect } from "react";
import { Trash2, Calendar, Star, MessageSquare, Loader2 } from "lucide-react";
import api from "../api";
import Navbar from "../components/navbar";

function Profile({ darkMode, setDarkMode, user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // Track which post is being deleted

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(postId); // Start loading for this specific post
    try {
      await api.delete(`/posts/${postId}/delete/`);
      
      // Optimistic Update
      setProfile((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== postId),
      }));
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete post.";
      alert(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        user={user} 
        setUser={setUser} 
        onPostCreated={fetchProfile} 
      />

      <main className="max-w-4xl mx-auto p-4 py-10">
        {/* User Header Card */}
        <div className="mb-10 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8">
          <div className="h-24 w-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl ring-4 ring-blue-50 dark:ring-blue-900/10">
            {profile?.username?.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              @{profile?.username}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-5 text-sm">
              <span className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                <Star size={16} /> {profile?.points} Karma
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                <Calendar size={16} /> Joined {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'Recent'}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                <MessageSquare size={16} /> {profile?.posts?.length || 0} Posts
              </span>
            </div>
          </div>
        </div>

        {/* Contributions Section */}
        <div className="space-y-6">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white px-2">
            Your Timeline
          </h3>
          
          {profile?.posts?.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 font-medium">No posts yet. Start a conversation!</p>
            </div>
          ) : (
            profile?.posts?.map((post) => (
              <div key={post.id} className="group relative flex justify-between items-center p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex gap-4 mt-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="text-blue-500">{post.likes_count || 0} Likes</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => deletePost(post.id)}
                  disabled={deletingId === post.id}
                  className={`md:opacity-0 md:group-hover:opacity-100 p-3 rounded-2xl transition-all duration-200 ${
                    deletingId === post.id 
                    ? "text-gray-300" 
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                  title="Delete Post"
                >
                  {deletingId === post.id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
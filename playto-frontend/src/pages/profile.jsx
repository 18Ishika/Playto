import { useState, useEffect } from "react";
import { Trash2, Calendar, Star, MessageSquare, Loader2 } from "lucide-react";
import api from "../api";
import Navbar from "../components/navbar";

function Profile({ darkMode, setDarkMode, user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile/");
      // DEBUG: Look at your browser console to see the structure of a single post!
      console.log("Profile Data:", res.data);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure?")) return;
    setDeletingId(postId);
    try {
      await api.delete(`/posts/${postId}/delete/`);
      setProfile((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== postId),
      }));
    } catch (err) {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  // --- IMPROVED FILTER LOGIC ---
  // This checks for common Django/Rest naming conventions
  const allContributions = profile?.posts || [];
  
  const userPosts = allContributions.filter(p => 
    p.parent_post === null || 
    p.parent === null || 
    p.is_comment === false ||
    (!p.parent_post && !p.parent) // If neither field exists, it's a post
  );

  const userComments = allContributions.filter(p => 
    p.parent_post !== null && p.parent_post !== undefined || 
    p.parent !== null && p.parent !== undefined ||
    p.is_comment === true
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors text-gray-900 dark:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} setUser={setUser} onPostCreated={fetchProfile} />

      <main className="max-w-4xl mx-auto p-4 py-10">
        {/* Header Section */}
        <div className="mb-10 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8">
          <div className="h-24 w-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-black">
            {profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black mb-2">@{profile?.username}</h1>
            <div className="flex gap-5 text-sm">
               <span className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                <Star size={16} /> {profile?.points} Karma
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8 w-fit">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "posts" ? "bg-white dark:bg-gray-700 shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Posts ({userPosts.length})
          </button>
          <button 
            onClick={() => setActiveTab("comments")}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "comments" ? "bg-white dark:bg-gray-700 shadow-md text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Comments ({userComments.length})
          </button>
        </div>

        {/* Feed Section */}
        <div className="space-y-4">
          {activeTab === "posts" ? (
            userPosts.length === 0 ? <EmptyState message="No original posts yet." /> :
            userPosts.map(post => <ContentCard key={post.id} data={post} onDelete={deletePost} deletingId={deletingId} type="post" />)
          ) : (
            userComments.length === 0 ? <EmptyState message="No comments yet." /> :
            userComments.map(comment => <ContentCard key={comment.id} data={comment} onDelete={deletePost} deletingId={deletingId} type="comment" />)
          )}
        </div>
      </main>
    </div>
  );
}

function ContentCard({ data, onDelete, deletingId, type }) {
  return (
    <div className="group relative p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {type === "comment" && (
            <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-2 block">
              ↳ Reply to Post
            </span>
          )}
          <p className="text-gray-800 dark:text-gray-200 text-lg">{data.content}</p>
          <div className="mt-4 flex gap-4 text-[10px] text-gray-400 font-bold uppercase">
            {type === "post" && <span>{data.likes_count || 0} Likes</span>}
            <span>{new Date(data.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {onDelete && (
          <button 
            onClick={() => onDelete(data.id)}
            disabled={deletingId === data.id}
            className="text-gray-300 hover:text-red-500 p-2 transition-colors"
          >
            {deletingId === data.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-gray-400">
      {message}
    </div>
  );
}

export default Profile;
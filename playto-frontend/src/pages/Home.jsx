import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import PostCard from "../components/postcard"; 
import api from "../api";

function Home({ darkMode, setDarkMode, user, setUser }) {
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const isLoggedIn = !!user;

  // Placeholder data for logged-out users
  const dummyPosts = [
    { 
      id: "d1", 
      author: { username: "CodingWizard", points: 120 }, 
      content: "Just started my first React project... 🚀", 
      created_at: new Date().toISOString(),
      likes_count: 12,
      replies_count: 5,
      is_liked_by_user: false,
      parent: null,
    }
  ];

  /**
   * Fetches both Posts and Leaderboard in parallel.
   * Using Promise.all ensures the loading state ends only when both are ready.
   */
  const fetchAllData = async (isMounted = true) => {
    try {
      const [postRes, lbRes] = await Promise.all([
        api.get(isLoggedIn ? '/posts/' : '/posts/dummy/'),
        api.get('/posts/leaderboard/')
      ]);

      if (isMounted) {
        setPosts(postRes.data);
        setLeaderboard(lbRes.data);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  // Initial load and re-fetch when login status changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchAllData(isMounted);
    return () => { isMounted = false; };
  }, [isLoggedIn]);

  /**
   * Handlers for child components
   */
  const handlePostCreated = (newPost) => {
    if (!newPost.parent) {
      // Optimistically add to top level if it's a post
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } else {
      // Navigate to detail if it's a reply
      navigate(`/post/${newPost.parent}`);
    }
    // Refresh leaderboard as posting grants karma
    fetchAllData(true); 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        user={user} 
        setUser={setUser} 
        onPostCreated={handlePostCreated}
      />

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Section */}
        <div className="lg:col-span-2 space-y-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Explore the Feed
            </h1>
            <p className="text-gray-500">Dive into the latest discussions.</p>
          </header>

          <section className="space-y-4">
            {isLoading ? (
              <>
                <PostCard isLoading={true} />
                <PostCard isLoading={true} />
              </>
            ) : (
              (isLoggedIn ? posts : dummyPosts).map((post) => (
                <div key={post.id} className="hover:transform hover:scale-[1.01] transition-all duration-200"> 
                  <PostCard 
                    post={post} 
                    isLoading={false} 
                    user={user} 
                    isDetailView={false}
                    onCommentSuccess={() => fetchAllData(true)}
                    onLikeSuccess={() => fetchAllData(true)}
                  />
                </div>
              ))
            )}

            {!isLoading && posts.length === 0 && isLoggedIn && (
              <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                No posts yet. Be the first to start a conversation!
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Leaderboard */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Karma (24h)
              </h2>
            </div>
            
            <div className="space-y-5">
              {leaderboard.length > 0 ? (
                leaderboard.map((u, index) => (
                  <div key={u.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                        index === 0 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                        {u.username}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-orange-500 font-bold">
                        +{u.recent_karma || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Karma</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">The climb hasn't started yet.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[11px] text-gray-400 text-center leading-relaxed font-medium">
                Karma is earned by receiving likes on posts (+5) and comments (+1).
              </p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}

export default Home;
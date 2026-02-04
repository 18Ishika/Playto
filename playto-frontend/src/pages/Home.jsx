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

  // --- EXPANDED DUMMY DATA ---
  const dummyPosts = [
    { 
      id: "d1", 
      author: { username: "CodingWizard", points: 1250 }, 
      content: "Just started my first React project... 🚀 The component-based architecture is a game changer. Any tips for state management?", 
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes_count: 42,
      replies_count: 12,
      is_liked_by_user: false,
      parent: null,
    },
    { 
      id: "d2", 
      author: { username: "Pythonista", points: 890 }, 
      content: "Is it just me, or does Python's list comprehension make code 10x more readable? Use it everywhere! 🐍", 
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      likes_count: 85,
      replies_count: 24,
      is_liked_by_user: false,
      parent: null,
    },
    { 
      id: "d3", 
      author: { username: "FrontendFanatic", points: 430 }, 
      content: "Dark mode vs Light mode: The eternal debate. I'm 100% team Dark Mode. What about you guys? 🌙", 
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      likes_count: 156,
      replies_count: 89,
      is_liked_by_user: false,
      parent: null,
    },
    { 
      id: "d4", 
      author: { username: "BugHunter", points: 2100 }, 
      content: "That feeling when you find the missing semicolon after 3 hours of debugging. Pure bliss. 🧘‍♂️", 
      created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      likes_count: 312,
      replies_count: 15,
      is_liked_by_user: false,
      parent: null,
    }
  ];

  // Modified to handle background refreshes silently
  const fetchAllData = async (isMounted = true, showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const [postRes, lbRes] = await Promise.all([
        isLoggedIn ? api.get('/posts/') : Promise.resolve({ data: dummyPosts }),
        api.get('/posts/leaderboard/')
      ]);

      if (isMounted) {
        setPosts(postRes.data);
        setLeaderboard(lbRes.data);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
      if (!isLoggedIn && isMounted) setPosts(dummyPosts);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  // --- POLLING LOGIC ---
  useEffect(() => {
    let isMounted = true;
    
    // 1. Initial Load (Shows Spinner)
    fetchAllData(isMounted, true);

    // 2. Set Interval for Polling (Every 30 seconds)
    const pollInterval = setInterval(() => {
      fetchAllData(isMounted, false); // False = Silent refresh
    }, 30000);

    // 3. Cleanup: Stop polling when component unmounts
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [isLoggedIn]);

  const handlePostCreated = (newPost) => {
    if (!newPost.parent) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } else {
      navigate(`/post/${newPost.parent}`);
    }
    fetchAllData(true, false); 
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
        <div className="lg:col-span-2 space-y-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              {isLoggedIn ? "Welcome back!" : "Explore the Community"}
            </h1>
            <p className="text-gray-500 font-medium">
              {isLoggedIn ? "Here's what happened while you were away." : "Sign in to join the conversation and earn karma."}
            </p>
          </header>

          <section className="space-y-4">
            {isLoading ? (
              <>
                <PostCard isLoading={true} />
                <PostCard isLoading={true} />
                <PostCard isLoading={true} />
              </>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="hover:transform hover:scale-[1.005] transition-all duration-200"> 
                  <PostCard 
                    post={post} 
                    isLoading={false} 
                    user={user} 
                    isDetailView={false}
                    onCommentSuccess={() => fetchAllData(true, false)}
                    onLikeSuccess={() => fetchAllData(true, false)}
                  />
                </div>
              ))
            )}

            {!isLoading && posts.length === 0 && (
              <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                <p className="text-lg font-medium">No posts yet.</p>
                <p className="text-sm">Be the first to start a conversation!</p>
              </div>
            )}
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
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
                      <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black ${
                        index === 0 ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-50" : 
                        index === 1 ? "bg-blue-50 text-blue-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-bold text-sm dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                        @{u.username}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-orange-500 font-black text-sm">
                        +{u.recent_karma || 0}
                      </span>
                      <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Points</span>
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
              <div className="bg-gray-50 dark:bg-black/40 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 text-center leading-relaxed font-bold uppercase tracking-wide">
                  Karma Rewards
                </p>
                <div className="flex justify-between mt-2 text-[11px] font-medium dark:text-gray-500">
                   <span>Post Like: <span className="text-green-500">+5</span></span>
                   <span>Reply: <span className="text-blue-500">+1</span></span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Home;
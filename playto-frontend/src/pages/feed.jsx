import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import PostCard from "../components/postcard"; // Ensure this matches your filename
import api from "../api"; // Import your custom axios instance

function Feed({ darkMode, setDarkMode }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using 'api' automatically handles the Base URL and the JWT Token
    api.get('/posts/') 
      .then((res) => {
        // Ensure res.data is actually an array
        setPosts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Feed error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Community Feed
        </h2>

        {loading ? (
          // Show 3 skeletons while loading
          <div className="space-y-6">
            <PostCard isLoading={true} />
            <PostCard isLoading={true} />
            <PostCard isLoading={true} />
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No posts found.</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} isLoading={false} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Feed;
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import PostCard from "../components/postcard"; 
import api from "../api";

function Home({ darkMode, setDarkMode, user, setUser }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isLoggedIn = !!user;

  // Function to instantly update the UI when a new post is created in the modal
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const dummyPosts = [
    { id: 1, author: { username: "CodingWizard" }, content: "Just started my first React project... 🚀", created_at: new Date().toISOString() },
    { id: 2, author: { username: "Pythonista" }, content: "Django Rest Framework + Vite is powerful.", created_at: new Date().toISOString() }
  ];

  useEffect(() => {
    if (isLoggedIn) {
      api.get('/posts/')
        .then(res => {
          setPosts(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching posts:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* ADDED: onPostCreated prop so the Navbar's modal can update this list */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        user={user} 
        setUser={setUser} 
        onPostCreated={handlePostCreated}
      />

      <main className="max-w-xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Playto
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoggedIn 
              ? `Glad to see you again, ${user}!` 
              : "A community-driven platform. Log in to join the conversation!"}
          </p>
        </header>

        <section className="space-y-6">
          {isLoggedIn ? (
            posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} isLoading={false} />)
            ) : (
              isLoading ? <PostCard isLoading={true} /> : <p className="dark:text-white">No posts yet.</p>
            )
          ) : (
            dummyPosts.map((post) => <PostCard key={post.id} post={post} isLoading={false} />)
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import PostDetail from "./pages/postdetail";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Dark Mode with Tailwind class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const token = localStorage.getItem("access");
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        {/* Public Feed */}
        <Route 
          path="/" 
          element={
            <Home 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              user={user} 
              setUser={setUser} 
            />
          } 
        />

        {/* Post Detail View */}
        <Route 
          path="/post/:id" 
          element={
            <PostDetail 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              user={user} 
              setUser={setUser} 
            />
          } 
        />

        {/* NEW: Profile Route (Protected) */}
        <Route 
          path="/profile" 
          element={
            user ? (
              <Profile 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                user={user} 
                setUser={setUser} 
              />
            ) : (
              <Navigate to="/auth" />
            )
          } 
        />
        
        {/* Auth Route */}
        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/" /> : <Auth setUser={setUser} />
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
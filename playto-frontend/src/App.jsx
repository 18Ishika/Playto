import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/auth";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Theme Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 2. Check for logged in user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const token = localStorage.getItem("access");
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // Prevent flicker on reload

  return (
    <Router>
      <Routes>
        {/* Home Route: Pass setUser so Navbar can handle Logout */}
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
        
        {/* Auth Route: Redirect to home if user is already logged in */}
        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/" /> : <Auth setUser={setUser} />
          } 
        / >
      </Routes>
    </Router>
  );
}

export default App;
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/auth";
import PostDetail from "./pages/postdetail"; // 1. Import the new page

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

        {/* 2. Add the Post Detail Route */}
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
        
        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/" /> : <Auth setUser={setUser} />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, PlusCircle } from "lucide-react"; 
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Add this import
import CreatePost from "./createpost";

function Navbar({ darkMode, setDarkMode, user, setUser, onPostCreated }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/auth');
  };

  return (
    <>
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            PLAYTO
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Create Post Icon Button */}
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                  title="Create Post"
                >
                  <PlusCircle size={24} />
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform border-2 border-white dark:border-gray-700"
                  >
                    {user.charAt(0).toUpperCase()}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Account</p>
                        <p className="text-sm font-bold dark:text-white truncate">@{user}</p>
                      </div>
                      
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                        <User size={16} /> Profile
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 font-medium transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Modal rendered OUTSIDE nav using portal - this is the fix! */}
      {showModal && createPortal(
        <CreatePost 
          onClose={() => setShowModal(false)} 
          onPostCreated={onPostCreated} 
        />,
        document.body // Render directly to body, bypassing nav's stacking context
      )}
    </>
  );
}

export default Navbar;
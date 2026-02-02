import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const res = await api.post('/api/token/', {
          username: formData.username,
          password: formData.password
        });
        
        // Store tokens
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('username', formData.username);

        // Update global App state immediately
        setUser(formData.username); 

        navigate('/'); 
      } else {
        // --- SIGNUP FLOW ---
        await api.post('/users/register/', formData);
        alert("Account created successfully! Please login.");
        setIsLogin(true); // Switch to login view
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data);
      // Extract specific error message from Django if possible
      const serverError = err.response?.data;
      setError(serverError?.detail || serverError?.username?.[0] || "Authentication failed. Please check your details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-md transition-all">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? "Welcome Back" : "Join Playto"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isLogin ? "Enter your details to sign in" : "Start sharing your ideas today"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          
          {!isLogin && (
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/20">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
          >
            {isLogin ? "New to Playto? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
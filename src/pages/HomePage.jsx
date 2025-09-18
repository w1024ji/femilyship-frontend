import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Configure axios base URL for your Spring Boot backend
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/topics');
      setPages(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to load topics. Please try again later.');
      // Fallback to mock data for development
      setPages([
        { id: 1, title_topic: 'Family Connections', content_topic: 'Connect with family members and build stronger relationships through shared experiences and memories.', authorUsername: 'admin' },
        { id: 2, title_topic: 'Event Planning', content_topic: 'Organize family gatherings, reunions, and special occasions with easy-to-use planning tools.', authorUsername: 'admin' },
        { id: 3, title_topic: 'Photo Sharing', content_topic: 'Share precious family moments and create collaborative photo albums that everyone can contribute to.', authorUsername: 'admin' },
        { id: 4, title_topic: 'Family Tree', content_topic: 'Build and explore your family history with interactive family tree features and genealogy tools.', authorUsername: 'admin' },
        { id: 5, title_topic: 'Communication Hub', content_topic: 'Stay in touch with family through group chats, announcements, and family newsletters.', authorUsername: 'admin' },
        { id: 6, title_topic: 'Memory Keeper', content_topic: 'Preserve family stories, traditions, and important milestones for future generations to treasure.', authorUsername: 'admin' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    // Optionally show a success message
    console.log('User logged out successfully');
  };

  const handleBoxClick = (pageId) => {
    // Navigate to topic detail page with the page ID
    navigate(`/topic/${pageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>
                Femilyship
              </h1>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Products</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Solutions</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Community</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Resources</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Link</a>
            </div>

            {/* Auth Buttons - Right side */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                // Show user info and logout when authenticated
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.username}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // Show login/register when not authenticated
                <>
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors border border-gray-300 rounded-lg hover:border-indigo-600"
                  >
                    <User size={18} />
                    <span>Sign in</span>
                  </button>
                  <button
                    onClick={handleRegister}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Products</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Solutions</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Community</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Resources</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Pricing</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Contact</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 py-2 px-4">Link</a>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated ? (
                    // Mobile logout button
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-gray-700 font-medium">
                        Welcome, {user?.username}!
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full text-left py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    // Mobile login/register buttons
                    <>
                      <button
                        onClick={handleLogin}
                        className="flex items-center space-x-2 w-full text-left py-2 px-4 text-gray-700 hover:text-indigo-600"
                      >
                        <User size={18} />
                        <span>Sign in</span>
                      </button>
                      <button
                        onClick={handleRegister}
                        className="flex items-center space-x-2 w-full text-left py-2 px-4 mt-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <UserPlus size={18} />
                        <span>Register</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Femilyship
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connecting families, creating memories, and building stronger bonds together.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md">
            {error}
          </div>
        )}

        {/* Content Boxes Grid */}
        <div className="max-w-6xl w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 cursor-pointer hover:scale-105 hover:border-indigo-300"
                  onClick={() => handleBoxClick(topic.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{topic.title_topic}</h3>
                      <p className="text-xs text-gray-500">by {topic.authorUsername}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{topic.content_topic}</p>
                  <div className="text-indigo-600 text-sm font-medium">
                    Click to explore →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
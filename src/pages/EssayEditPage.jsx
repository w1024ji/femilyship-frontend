import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const EssayEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [essay, setEssay] = useState(null);
  const [formData, setFormData] = useState({
    title_essay: '',
    content_essay: '',
    topicId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios base URL
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    fetchEssay();
  }, [id]);

  const fetchEssay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the token for authenticated requests
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await axios.get(`/api/essays/${id}`, { headers });
      const essayData = response.data;
      
      setEssay(essayData);
      setFormData({
        title_essay: essayData.title_essay || '',
        content_essay: essayData.content_essay || '',
        topicId: essayData.topicId || ''
      });

      // Check if user is authorized to edit this essay
      if (user?.username !== essayData.authorUsername) {
        setError('You are not authorized to edit this essay.');
        return;
      }

    } catch (err) {
      console.error('Error fetching essay:', err);
      
      if (err.response?.status === 404) {
        setError('Essay not found');
      } else if (err.response?.status === 403) {
        setError('You are not authorized to edit this essay');
      } else if (err.response?.status === 401) {
        setError('Please log in to edit essays');
      } else {
        setError('Failed to load essay. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to edit essays');
      return;
    }

    if (!formData.title_essay.trim() || !formData.content_essay.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      console.log('Making PUT request to update essay with ID:', id);
      console.log('Token exists:', !!token);
      console.log('Request payload:', {
        title_essay: formData.title_essay,
        content_essay: formData.content_essay,
        topicId: formData.topicId
      });
      
      // Make sure axios has the default headers set
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.put(`/api/essays/${id}`, {
        title_essay: formData.title_essay,
        content_essay: formData.content_essay,
        topicId: formData.topicId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Add this for CORS
      });

      console.log('Essay updated successfully:', response.data);
      
      // Navigate back to the essay detail page
      navigate(`/essay/${id}`);
      
    } catch (err) {
      console.error('Error updating essay:', err);
      console.log('Full error response:', err.response);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You are not authorized to edit this essay');
      } else if (err.response?.status === 404) {
        setError('Essay not found');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update essay. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/essay/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-8"></div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
              <div className="h-32 bg-gray-300 rounded mb-6"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !essay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cannot Edit Essay</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/essay/${id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Essay
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Cancel Edit
        </button>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Essay
            </h1>
            <p className="text-gray-600 mt-2">
              Make changes to your essay below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="px-8 py-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Title Field */}
            <div className="mb-6">
              <label htmlFor="title_essay" className="block text-sm font-medium text-gray-700 mb-2">
                Essay Title
              </label>
              <input
                type="text"
                id="title_essay"
                name="title_essay"
                value={formData.title_essay}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter essay title..."
                required
                disabled={isSaving}
              />
            </div>

            {/* Content Field */}
            <div className="mb-8">
              <label htmlFor="content_essay" className="block text-sm font-medium text-gray-700 mb-2">
                Essay Content
              </label>
              <textarea
                id="content_essay"
                name="content_essay"
                value={formData.content_essay}
                onChange={handleInputChange}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your essay content here..."
                required
                disabled={isSaving}
              />
              <p className="mt-2 text-sm text-gray-500">
                You can use basic formatting like line breaks and paragraphs.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EssayEditPage;
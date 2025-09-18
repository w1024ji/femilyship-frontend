import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, FileText, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';

const TopicDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios base URL
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    fetchTopicAndEssays();
  }, [id]);

  const fetchTopicAndEssays = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch topic details (which includes essays array)
      const response = await axios.get(`/api/topics/${id}`);
      
      setTopic(response.data);
      // The API returns essays as part of the topic object
      setEssays(response.data.essays || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      
      if (err.response?.status === 404) {
        setError('Topic not found');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load content. Please try again later.');
      }

      // Fallback mock data for development
      if (process.env.NODE_ENV === 'development') {
        setTopic({
          id: parseInt(id),
          title_topic: 'Sample Topic',
          content_topic: 'This is a sample topic content for development.',
          authorUsername: 'sampleuser'
        });
        setEssays([
          {
            id: 1,
            title_essay: 'Understanding Family Dynamics',
            content_essay: 'Family dynamics play a crucial role in shaping our relationships and personal development. In this essay, we explore the various factors that influence how families interact and communicate with each other. We discuss the importance of open communication, mutual respect, and understanding in building stronger family bonds...',
            authorUsername: 'Dr. Sarah Johnson',
            topicId: parseInt(id)
          },
          {
            id: 2,
            title_essay: 'Building Stronger Family Bonds',
            content_essay: 'Creating meaningful connections within families requires intentional effort and understanding. This piece discusses practical strategies for strengthening family relationships and fostering deeper emotional connections. We explore various activities and approaches that can help families spend quality time together...',
            authorUsername: 'Michael Chen',
            topicId: parseInt(id)
          },
          {
            id: 3,
            title_essay: 'The Evolution of Modern Families',
            content_essay: 'Family structures have evolved significantly over the past few decades. This essay examines how changing social, economic, and technological factors have reshaped the traditional family unit. We analyze the impact of these changes on family dynamics and relationships...',
            authorUsername: 'Prof. Emily Rodriguez',
            topicId: parseInt(id)
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEssayClick = (essayId) => {
    // Navigate to individual essay page
    navigate(`/essay/${essayId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header skeleton */}
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-96"></div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          
          {error ? (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : topic ? (
            <div>
              <div className="flex items-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mr-4">
                  {topic.title_topic}
                </h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  by {topic.authorUsername}
                </span>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl">
                {topic.content_topic}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Essays List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && !topic ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Unable to load content</p>
            <button
              onClick={fetchTopicAndEssays}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : essays.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Essays Yet</h3>
            <p className="text-gray-500">
              There are no essays available for this topic at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Essays ({essays.length})
              </h2>
            </div>

            {essays.map((essay) => (
              <article
                key={essay.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-300"
                onClick={() => handleEssayClick(essay.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex-1 mr-4">
                      {essay.title_essay}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium whitespace-nowrap">
                      by {essay.authorUsername}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {essay.content_essay.length > 200 
                      ? `${essay.content_essay.substring(0, 200)}...` 
                      : essay.content_essay
                    }
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FileText size={16} className="mr-1" />
                        <span>Essay #{essay.id}</span>
                      </div>
                    </div>
                    
                    <div className="text-indigo-600 font-medium">
                      Read more →
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetailPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, AlertCircle, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const EssayDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [essay, setEssay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Configure axios base URL
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    fetchEssay();
    // Get current user from localStorage if available
    const username = localStorage.getItem('username');
    if (username) {
      setCurrentUser(username);
    }
  }, [id]);

  const fetchEssay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`/api/essays/${id}`);
      setEssay(response.data);
    } catch (err) {
      console.error('Error fetching essay:', err);
      
      if (err.response?.status === 404) {
        setError('Essay not found');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load essay. Please try again later.');
      }

      // Fallback mock data for development
      if (process.env.NODE_ENV === 'development') {
        setEssay({
          id: parseInt(id),
          title_essay: 'Understanding Family Dynamics',
          content_essay: `Family dynamics play a crucial role in shaping our relationships and personal development. In this comprehensive essay, we explore the various factors that influence how families interact and communicate with each other.

## The Foundation of Family Relationships

At the heart of every family lies a complex web of relationships, emotions, and shared experiences. Understanding these dynamics is essential for building stronger, more meaningful connections with our loved ones.

### Communication Patterns

Effective communication serves as the cornerstone of healthy family relationships. When family members feel heard and understood, they are more likely to:

- Express their emotions openly
- Share their concerns and challenges
- Seek support during difficult times
- Celebrate achievements together

### Roles and Responsibilities

Each family member naturally assumes certain roles and responsibilities within the family structure. These roles can be:

**Traditional Roles:**
- Parents as providers and protectors
- Children as learners and dependents
- Siblings as companions and rivals

**Modern Adaptations:**
- Flexible parenting approaches
- Shared household responsibilities
- Children as active participants in family decisions

## Building Stronger Connections

Creating meaningful connections within families requires intentional effort and understanding. Some effective strategies include:

1. **Regular Family Time**: Scheduling consistent opportunities for family interaction
2. **Active Listening**: Truly hearing what each family member has to say
3. **Conflict Resolution**: Addressing disagreements constructively
4. **Shared Goals**: Working together toward common objectives
5. **Celebrating Differences**: Appreciating each person's unique qualities

## Conclusion

Family dynamics are ever-evolving, influenced by countless internal and external factors. By understanding these patterns and actively working to strengthen our family bonds, we can create more harmonious, supportive, and loving family environments.

The journey of understanding family dynamics is ongoing, requiring patience, empathy, and commitment from all family members. When we invest in these relationships, we build a foundation that can weather life's challenges and celebrate its joys together.`,
          authorUsername: 'Dr. Sarah Johnson',
          topicId: 1
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToTopic = () => {
    if (essay && essay.topicId) {
      navigate(`/topic/${essay.topicId}`);
    } else {
      navigate('/');
    }
  };

  const handleEdit = () => {
    // Navigate to edit page (you'll need to create this)
    navigate(`/essay/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this essay?')) {
      return;
    }

    try {
      await axios.delete(`/api/essays/${id}`);
      // Navigate back to topic page after successful deletion
      handleBackToTopic();
    } catch (err) {
      console.error('Error deleting essay:', err);
      alert('Failed to delete essay. Please try again.');
    }
  };

  const formatContent = (content) => {
    // Simple formatting for line breaks and basic markdown-like syntax
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('##')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              {paragraph.replace('##', '').trim()}
            </h2>
          );
        } else if (paragraph.startsWith('###')) {
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              {paragraph.replace('###', '').trim()}
            </h3>
          );
        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          return (
            <h4 key={index} className="text-lg font-medium text-gray-800 mt-4 mb-2">
              {paragraph.replace(/\*\*/g, '')}
            </h4>
          );
        } else if (paragraph.includes('- ')) {
          const items = paragraph.split('- ').filter(item => item.trim());
          return (
            <ul key={index} className="list-disc list-inside mb-4 text-gray-700 leading-relaxed space-y-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{item.trim()}</li>
              ))}
            </ul>
          );
        } else if (paragraph.match(/^\d+\./)) {
          const items = paragraph.split(/\d+\./).filter(item => item.trim());
          return (
            <ol key={index} className="list-decimal list-inside mb-4 text-gray-700 leading-relaxed space-y-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{item.trim()}</li>
              ))}
            </ol>
          );
        } else {
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          );
        }
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-8"></div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Essay</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchEssay}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
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
          onClick={handleBackToTopic}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Topic
        </button>

        {/* Essay Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {essay.title_essay}
                </h1>
                <div className="flex items-center text-gray-600">
                  <User size={18} className="mr-2" />
                  <span className="font-medium">{essay.authorUsername}</span>
                </div>
              </div>
              
              {/* Action Buttons - Only show if current user is the author */}
              {currentUser && currentUser === essay.authorUsername && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-1 px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Essay"
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Essay"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none">
              {formatContent(essay.content_essay)}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <FileText size={16} className="mr-1" />
                <span className="text-sm">Essay ID: {essay.id}</span>
              </div>
              
              <button
                onClick={handleBackToTopic}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View More Essays
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default EssayDetailPage;
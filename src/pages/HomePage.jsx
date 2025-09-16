import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm'; // Import the new component

export default function HomePage({ currentUser, setToken }) {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/topics');
        if (!response.ok) throw new Error('Failed to fetch topics');
        const data = await response.json();
        setTopics(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Show AuthForm only if user is NOT logged in */}
      {!currentUser && <AuthForm setToken={setToken} />}

      {/* The topic list takes full width if logged in, or 2/3 width if logged out */}
      <div className={currentUser ? 'md:col-span-3' : 'md:col-span-2'}>
        <h2 className="text-2xl font-semibold mb-4">Topics</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {topics.map(topic => (
            <Link key={topic.id} to={`/topics/${topic.id}`} className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-blue-600">{topic.name}</h3>
              <p className="text-gray-600">{topic.pages.length} pages inside</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
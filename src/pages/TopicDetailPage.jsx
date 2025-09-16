import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function TopicDetailPage() {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { topicId } = useParams();

  useEffect(() => {
    // ... fetch logic is the same
    const fetchTopicDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8080/api/topics/${topicId}`);
          if (response.ok) {
            const data = await response.json();
            setTopic(data);
          } else {
            setError('Failed to fetch topic details.');
          }
        } catch (err) {
          setError('An error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchTopicDetails();
  }, [topicId]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!topic) return <div className="text-center p-10">Topic not found.</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">{topic.name}</h1>
      <p className="text-lg text-gray-600 mb-6">Pages within this topic.</p>
      
      <div className="space-y-6">
        {topic.pages && topic.pages.length > 0 ? (
          topic.pages.map(page => (
            <div key={page.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-2xl font-bold mb-2">{page.title}</h4>
              <p className="text-sm text-gray-500 mb-4">by {page.authorUsername}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{page.content}</p>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-500">No pages in this topic yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
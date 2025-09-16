import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HomePage from './pages/HomePage';
import TopicDetailPage from './pages/TopicDetailPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setCurrentUser({ username: decodedToken.sub }); // 'sub' is the standard claim for username
    } else {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-gray-900">Femilyship Topics</Link>
          {currentUser && (
            <div>
              <span className="mr-4">Welcome, {currentUser.username}!</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage currentUser={currentUser} setToken={setToken} />} 
          />
          <Route 
            path="/topics/:topicId" 
            element={<TopicDetailPage />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
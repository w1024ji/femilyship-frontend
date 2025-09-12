import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // We'll need to install this library

function App() {
  // State for displaying pages
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);

  // --- NEW AUTHENTICATION STATE ---
  const [token, setToken] = useState(localStorage.getItem('token')); // Load token from local storage
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login and Register

  // State for the auth forms
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  // Effect to fetch pages (runs on initial load)
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/pages');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPages(data);
      } catch (e) {
        setError(`Error fetching data: ${e.message}`);
      }
    };
    fetchPages();
  }, []);
  
  // --- NEW EFFECT FOR TOKEN ---
  // This effect runs whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token); // Save token to local storage
      const decodedToken = jwtDecode(token);
      setCurrentUser({ username: decodedToken.sub }); // 'sub' is the standard claim for username in JWT
    } else {
      localStorage.removeItem('token'); // Remove token if it's null
      setCurrentUser(null);
    }
  }, [token]);


  // --- HANDLERS FOR AUTH FORMS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    const endpoint = isLoginView ? 'login' : 'register';
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use error message from backend if available, otherwise use default
        throw new Error(data.message || (isLoginView ? 'Login failed' : 'Registration failed'));
      }
      
      if(isLoginView) {
        setToken(data.accessToken); // Assuming your LoginResponse has an "accessToken" field
      } else {
        setAuthMessage('Registration successful! Please log in.');
        setIsLoginView(true); // Switch to login view after successful registration
      }
      setUsername('');
      setPassword('');

    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const handleLogout = () => {
    setToken(null); // This will trigger the useEffect to clear local storage and user
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Femilyship Book</h1>
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

      <main className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* --- DYNAMIC AUTHENTICATION SECTION --- */}
        {!currentUser && (
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex border-b mb-4">
              <button onClick={() => setIsLoginView(true)} className={`w-1/2 py-2 ${isLoginView ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>Login</button>
              <button onClick={() => setIsLoginView(false)} className={`w-1/2 py-2 ${!isLoginView ? 'border-b-2 border-blue-500 font-semibold' : ''}`}>Register</button>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">{isLoginView ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                {isLoginView ? 'Login' : 'Register'}
              </button>
            </form>
            {authMessage && (
              <div className={`mt-4 p-4 rounded ${authMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {authMessage}
              </div>
            )}
          </div>
        )}
        
        <div className={currentUser ? 'md:col-span-3' : 'md:col-span-2'}>
          <h2 className="text-2xl font-semibold mb-4">Book Pages</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 gap-6">
            {pages.map((page) => (
              <div key={page.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2">{page.title} - Page {page.pageNumber}</h3>
                <p className="text-gray-600 mb-4">By {page.author}</p>
                <p className="text-gray-700">{page.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


// ```

// **One Important Final Step:**

// The code uses a small library, `jwt-decode`, to easily read the information inside the JWT without needing to do complex validation on the frontend. We need to install it.

// 1.  **Stop your React development server** (press `Ctrl + C` in the terminal where it's running).
// 2.  Run the following command in that same terminal (inside your `femilyship-frontend` folder):
//     ```bash
//     npm install jwt-decode
//     ```
// 3.  After it finishes, restart the server:
//     ```bash
//     npm run dev
    


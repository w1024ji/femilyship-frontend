import { useState } from 'react';

// We pass setToken function from App.jsx so this component can update the global state
export default function AuthForm({ setToken }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

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
        throw new Error(data.message || (isLoginView ? 'Login failed' : 'Registration failed'));
      }
      
      if(isLoginView) {
        // Use the token name from your backend. Let's assume it's 'token'
        setToken(data.accessToken); 
      } else {
        setAuthMessage('Registration successful! Please log in.');
        setIsLoginView(true); // Switch to login view
      }
      setUsername('');
      setPassword('');

    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  return (
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
  );
}
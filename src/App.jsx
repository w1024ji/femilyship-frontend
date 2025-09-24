import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import TopicDetailPage from './pages/TopicDetailPage';
import EssayDetailPage from './pages/EssayDetailPage';
import EssayEditPage from './pages/EssayEditPage';
import AuthForm from './components/AuthForm';
import './App.css';

function App() {
  return (
    <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topic/:id" element={<TopicDetailPage />} />
            <Route path="/essay/:id" element={<EssayDetailPage />} />
            <Route path="/essay/:id/edit" element={<EssayEditPage/>} />
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/register" element={<AuthForm type="register" />} />
          </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;
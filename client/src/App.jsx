import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { AuthProvider, useAuth } from './context/AuthContext';


function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token
    ? children
    : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
          <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

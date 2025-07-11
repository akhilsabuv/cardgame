import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/auth/login', { email, password });
      login(res.data.token);
      navigate('/lobby');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="login-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="login-input"
            required
          />
        </div>
        <div className="login-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
            className="login-input"
            required
          />
        </div>
        <div className="login-actions">
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <div className="spinner" /> : 'Log In'}
          </button>
        </div>
        <p className="login-footer">
          Don’t have an account? <Link to="/signup" className="login-link">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

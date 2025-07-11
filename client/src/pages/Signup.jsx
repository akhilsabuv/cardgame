import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/auth/signup', { email, nickname, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create an Account</h2>
        {error && <div className="signup-error">{error}</div>}
        <div className="signup-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="signup-input"
            required
          />
        </div>
        <div className="signup-group">
          <label>Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Your nickname"
            className="signup-input"
            required
          />
        </div>
        <div className="signup-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
            className="signup-input"
            required
          />
        </div>
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? <div className="spinner" /> : 'Sign Up'}
        </button>
        <p className="signup-footer">
          Already have an account? <Link to="/login" className="signup-link">Log In</Link>
        </p>
      </form>
    </div>
  );
}

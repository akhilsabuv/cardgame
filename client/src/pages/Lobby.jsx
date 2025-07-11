// client/src/pages/Lobby.jsx

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';

export default function Lobby() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // 1) Fetch current user and open socket with handshake info
  useEffect(() => {
    axios.get('http://localhost:4000/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const me = res.data;
      setUser(me);
      socketRef.current = io('http://localhost:4000', {
        auth: {
          token,
          userId: me.id,
          nickname: me.nickname
        }
      });
    })
    .catch(() => alert('Failed to load user info'));
  }, [token]);

  // 2) Join lobby and listen for roster & startGame
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !user) return;

    // Tell server we’re joining
    socket.emit('joinLobby', user.id);

    // Receive the current roster
    socket.on('existingPlayers', list => {
      setPlayers(list);
    });

    // When someone joins
    socket.on('playerJoined', p => {
      setPlayers(prev =>
        prev.some(x => x.userId === p.userId) ? prev : [...prev, p]
      );
    });

    // When someone leaves
    socket.on('playerLeft', ({ userId }) => {
      setPlayers(prev => prev.filter(x => x.userId !== userId));
    });

    // When game starts
    socket.on('gameStarted', ({ gameId }) => {
      navigate('/game', { state: { gameId } });
    });

    return () => {
      socket.off('existingPlayers');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('gameStarted');
    };
  }, [user, navigate]);

  // Emit startGame to everyone
  const handleStart = () => {
    socketRef.current.emit('startGame', { gameId: 1 });
  };

  // Logout and return to login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <div className="lobby-header">
          <h1>🃏 Lobby</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <p className="welcome">
          Logged in as <strong>{user?.nickname}</strong>
        </p>

        <div className="player-grid">
          {players.map(p => (
            <div key={p.userId} className="player-card">
              <div className="avatar">
                {p.nickname.charAt(0).toUpperCase()}
              </div>
              <span className="player-name">{p.nickname}</span>
            </div>
          ))}
        </div>

        {players.length >= 2 ? (
          <button className="btn-start" onClick={handleStart}>
            Start Game
          </button>
        ) : (
          <p className="waiting">Waiting for at least 2 players...</p>
        )}
      </div>
    </div>
  );
}

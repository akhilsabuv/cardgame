// client/src/pages/Game.jsx

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './Game.css';

export default function Game() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { state: { gameId } = {} } = useLocation();

  const [user, setUser] = useState(null);
  const [roundData, setRoundData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [hasBid, setHasBid] = useState(false);

  const socketRef = useRef(null);
  const timerRef = useRef(null);

  // 1) Fetch user & connect socket
  useEffect(() => {
    axios.get('http://localhost:4000/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const me = res.data;
      setUser(me);
      const sock = io('http://localhost:4000', {
        auth: { token, userId: me.id, nickname: me.nickname }
      });
      socketRef.current = sock;
      sock.emit('joinLobby', me.id);
    })
    .catch(() => {
      alert('Session expired. Please log in again.');
      navigate('/login');
    });

    return () => {
      clearInterval(timerRef.current);
      socketRef.current?.disconnect();
    };
  }, [token, navigate]);

  // 2) Listen for gameStarted & roundStarted
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !user) return;

    // First round via gameStarted
    sock.on('gameStarted', data => {
      setRoundData({ round: data.round, card: data.card, countdown: data.countdown });
      setHasBid(false);
      setBidAmount('');
      setTimeLeft(data.countdown);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => (t > 1 ? t - 1 : 0));
      }, 1000);
    });

    // Subsequent rounds via roundStarted
    sock.on('roundStarted', data => {
      setRoundData(data);
      setHasBid(false);
      setBidAmount('');
      setTimeLeft(data.countdown);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => (t > 1 ? t - 1 : 0));
      }, 1000);
    });

    sock.on('roundResult', result => {
      if (result.winner) {
        alert(`🏆 Round ${result.round} winner: ${result.winner.id} (bid ${result.bid})`);
      } else {
        alert(`⚪ Round ${result.round} ended with no bids.`);
      }
    });

    sock.on('gameOver', ({ champion }) => {
      alert(`🎉 Game Over! Champion: ${champion.nickname} (Power ${champion.power_points})`);
      navigate('/leaderboard');
    });

    return () => {
      sock.off('gameStarted');
      sock.off('roundStarted');
      sock.off('roundResult');
      sock.off('gameOver');
    };
  }, [user, navigate]);

  // 3) Place bid
  const placeBid = () => {
    if (!roundData || hasBid || timeLeft === 0) return;
    socketRef.current.emit('bid', {
      gameId,
      userId: user.id,
      round: roundData.round,
      amount: Number(bidAmount)
    });
    setHasBid(true);
  };

  // 4) Navigation
  const goLobby = () => navigate('/lobby');
  const doLogout = () => { logout(); navigate('/login'); };

  // 5) Render
  if (!roundData) {
    return (
      <div className="game-container">
        <div className="game-header">
          <div className="user-info">
            <span>{user?.nickname}</span>&nbsp;
            <span>Coins: {user?.coins}</span>
          </div>
          <div className="actions">
            <button className="btn-lobby" onClick={goLobby}>← Lobby</button>
            <button className="btn-logout" onClick={doLogout}>Logout</button>
          </div>
        </div>
        <p>Waiting for the first round to start…</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="user-info">
          <span>{user.nickname}</span>&nbsp;
          <span>Coins: {user.coins}</span>
        </div>
        <div className="actions">
          <button className="btn-lobby" onClick={goLobby}>← Lobby</button>
          <button className="btn-logout" onClick={doLogout}>Logout</button>
        </div>
      </div>

      <h2>Round {roundData.round}</h2>

      <div className="card-stats">
        <div><strong>Power:</strong> {roundData.card.power}</div>
        <div><strong>Heal:</strong> {roundData.card.heal}</div>
        <div><strong>Extra $:</strong> {roundData.card.extra_money}</div>
      </div>

      <div className="timer">
        Time left: <span className={timeLeft <= 10 ? 'warning' : ''}>{timeLeft}s</span>
      </div>

      <div className="bid-input">
        <input
          type="number"
          min="0"
          value={bidAmount}
          onChange={e => setBidAmount(e.target.value)}
          disabled={hasBid || timeLeft === 0}
          placeholder="Enter your bid"
        />
        <button onClick={placeBid} disabled={hasBid || timeLeft === 0}>
          {hasBid ? 'Bid Placed' : 'Place Bid'}
        </button>
      </div>
    </div>
  );
}

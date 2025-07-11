import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/leaderboard')
      .then(res => setLeaders(res.data))
      .catch(() => alert('Failed to load leaderboard'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-2">
      <h1 className="text-2xl">Leaderboard</h1>
      <ul>
        {leaders.map((p,i) =>
          <li key={p.username || p.id}>{i+1}. {p.username || p.email}: {p.power_points}</li>
        )}
      </ul>
    </div>
  );
}

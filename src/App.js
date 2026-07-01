import { useState } from 'react';
import './App.css';

const coinSides = [
  {
    name: 'Heads',
    emoji: '🙂',
    description: 'The obverse side usually features a portrait or emblem.'
  },
  {
    name: 'Tails',
    emoji: '🪙',
    description: 'The reverse side typically displays a motif, motto, or national crest.'
  }
];

function App() {
  const [currentSide, setCurrentSide] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ Heads: 0, Tails: 0 });

  const tossCoin = () => {
    const nextSide = coinSides[Math.floor(Math.random() * coinSides.length)];
    setCurrentSide(nextSide);
    setHistory(prev => [nextSide, ...prev].slice(0, 5));
    setStats(prev => ({
      ...prev,
      [nextSide.name]: prev[nextSide.name] + 1
    }));
  };

  const resetStats = () => {
    setCurrentSide(null);
    setHistory([]);
    setStats({ Heads: 0, Tails: 0 });
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">React Demo</p>
        <h1>Coin Toss Studio</h1>
        <p className="subtitle">
          Flip a virtual coin, track the last five outcomes, and watch the stats stay honest.
        </p>
      </header>

      <section className="controls">
        <button type="button" onClick={tossCoin} className="primary">
          Toss the coin
        </button>
        <button type="button" onClick={resetStats} className="secondary">
          Reset
        </button>
      </section>

      <section className="result-card">
        {currentSide ? (
          <div className="result-content">
            <span className="coin-face">{currentSide.emoji}</span>
            <div>
              <h2>{currentSide.name}</h2>
              <p>{currentSide.description}</p>
            </div>
          </div>
        ) : (
          <p className="placeholder">Click “Toss the coin” to reveal the result.</p>
        )}
      </section>

      <section className="stats-card">
        <h3>Live Stats</h3>
        <div className="stats-grid">
          {Object.entries(stats).map(([name, value]) => (
            <div key={name} className="stat">
              <p>{name}</p>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="history-card">
        <h3>Recent Tosses</h3>
        {history.length === 0 ? (
          <p className="placeholder">No tosses yet.</p>
        ) : (
          <ul className="history-list">
            {history.map((entry, index) => (
              <li key={`${entry.name}-${index}`}>>
                <span className="coin-face">{entry.emoji}</span>
                <span>{entry.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;

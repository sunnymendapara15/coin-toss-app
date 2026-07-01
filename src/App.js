
import { useEffect, useRef, useState } from 'react';
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
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const flipTimerRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => () => {
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const getAudioContext = () => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }
    if (typeof window === 'undefined') {
      return null;
    }
    const Candidate = window.AudioContext || window.webkitAudioContext;
    if (!Candidate) {
      return null;
    }
    audioContextRef.current = new Candidate();
    return audioContextRef.current;
  };

  const playCoinSound = () => {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(420 + Math.random() * 240, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 1.1);
  };

  const tossCoin = () => {
    const nextSide = coinSides[Math.floor(Math.random() * coinSides.length)];
    setCurrentSide(nextSide);
    setHistory(prev => [nextSide, ...prev].slice(0, 5));
    setStats(prev => ({
      ...prev,
      [nextSide.name]: prev[nextSide.name] + 1
    }));

    setIsFlipping(true);
    playCoinSound();
    setRotation(prev => {
      const baseSpins = 720;
      const targetAngle = nextSide.name === 'Tails' ? 180 : 0;
      const normalizedPrev = prev % 360;
      const angleDifference = (targetAngle - normalizedPrev + 360) % 360;
      return prev + baseSpins + angleDifference;
    });

    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
    }

    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
      flipTimerRef.current = null;
    }, 1100);
  };

  const resetStats = () => {
    setCurrentSide(null);
    setHistory([]);
    setStats({ Heads: 0, Tails: 0 });
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
    setIsFlipping(false);
    setRotation(0);
  };

  const coinStyle = {
    transform: `rotateY(${rotation}deg)`
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

      <section className="coin-stage">
        <div className="coin-stage-inner">
          <div className={`coin-3d ${isFlipping ? 'flipping' : ''}`} style={coinStyle}>
            <div className="coin-surface front">
              <span>Heads</span>
            </div>
            <div className="coin-surface back">
              <span>Tails</span>
            </div>
            <div className="coin-rim" />
          </div>
        </div>
        <p className="coin-stage-note">
          A metallic coin spins with depth, shadows, and a short chime whenever you launch a toss.
        </p>
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
              <li key={`${entry.name}-${index}`}>
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

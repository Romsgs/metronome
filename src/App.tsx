import React, { useState, useEffect } from "react";
import "./Metronome.css";

const BPM_LABELS = [
  { label: "Lentíssimo", range: [1, 39] },
  { label: "Grave", range: [40, 43] },
  { label: "Largo", range: [44, 49] },
  { label: "Lento", range: [50, 54] },
  { label: "Adágio", range: [54, 60] },
  { label: "Larghetto", range: [58, 63] },
  { label: "Andante", range: [63, 72] },
  { label: "Andantino", range: [69, 80] },
  { label: "Sostenuto", range: [76, 84] },
  { label: "Maestoso", range: [84, 88] },
  { label: "Moderato", range: [88, 104] },
  { label: "Allegretto", range: [104, 120] },
  { label: "Animato", range: [120, 131] },
  { label: "Allegro", range: [132, 159] },
  { label: "Vivace / Vivo", range: [160, 183] },
  { label: "Presto", range: [184, 207] },
  { label: "Prestíssimo", range: [208, 300] },
  { label: "Crazy asian kid", range: [300] },
];

const Metronome: React.FC = () => {
  const [bpm, setBpm] = useState<number>(80);
  const [playing, setPlaying] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContext) {
      setAudioContext(new AudioContext());
    }
  }, []);

  const getBpmLabel = (bpm: number): string => {
    const labels = BPM_LABELS.filter(({ range }) => bpm >= range[0] && bpm <= range[1])
      .map(({ label }) => label);
    return labels.length > 0 ? labels.join(" / ") : "Desconhecido";
  };

  const playClick = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const startMetronome = () => {
    if (!playing) {
      if (!audioContext) return;
      const interval = window.setInterval(playClick, (60 / bpm) * 1000);
      setIntervalId(interval);
    } else {
      if (intervalId !== null) clearInterval(intervalId);
      setIntervalId(null);
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) {
      if (intervalId !== null) clearInterval(intervalId);
      const interval = window.setInterval(playClick, (60 / bpm) * 1000);
      setIntervalId(interval);
    }
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [bpm, playing]);

  return (
    <div className="metronome-container">
      <h2 className="metronome-title">Metrônomo</h2>
      <br></br>
      <p className="bpm-display">BPM: {bpm} </p>
      <p className="bpm-name">{getBpmLabel(bpm)}</p>
      <div className="bpm-controls">
        <button className="bpm-button" onClick={() => setBpm(prev => Math.max(40, prev - 1))}>-</button>
        <input
          type="range"
          min="40"
          max="300"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="bpm-slider"
        />
        <button className="bpm-button" onClick={() => setBpm(prev => Math.min(208, prev + 1))}>+</button>
      </div>
      
      <button className="start-stop-button" onClick={startMetronome}>
        {playing ? "Parar" : "Iniciar"}
      </button>
    </div>
  );
};

export default Metronome;

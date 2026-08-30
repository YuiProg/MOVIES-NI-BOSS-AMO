import React, { useEffect, useState } from 'react';
import tadum from '../assets/nouveau-jingle-netflix.mp3'

export default function IntroAnimation({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Play optional sub-bass / intro audio ping if available
    const audio = new Audio(tadum);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignore autoplay restrictions if blocked

    // Start fade out at 2.2s
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2200);

    // Complete intro at 2.8s
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`intro-overlay ${fadingOut ? 'fade-out' : ''}`}>
      <div className="intro-content">
        <div className="intro-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1 className="intro-logo">XAVI</h1>
      </div>
    </div>
  );
}
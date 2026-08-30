import React, { useState, useEffect } from 'react';

export default function TopBar({ query, onSearch }) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.bridge?.onMaximized) {
      const unsubscribe = window.bridge.onMaximized((maximized) => {
        setIsMaximized(maximized);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleMinimize = () => window.bridge?.minimizeWindow();
  const handleMaximize = () => window.bridge?.maximizeWindow();
  const handleClose = () => window.bridge?.closeWindow();

  return (
    <header className="topbar">
      {/* Left: Branding / App Title */}
      <div className="topbar-left">
        <div className="topbar-badge">M</div>
        <span className="topbar-title">YuiDev</span>
      </div>

      {/* Middle: Search Field */}
      <div className="search-wrap">
        <input
          type="text"
          className="search-input"
          placeholder="Search titles..."
          value={query || ''}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Right: Custom Window Action Buttons */}
      <div className="window-controls">
        <button
          className="control-btn"
          onClick={handleMinimize}
          title="Minimize"
          aria-label="Minimize"
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <rect width="10" height="1" fill="currentColor" />
          </svg>
        </button>

        <button
          className="control-btn"
          onClick={handleMaximize}
          title={isMaximized ? "Restore" : "Maximize"}
          aria-label="Maximize"
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M2.5,0.5 L9.5,0.5 L9.5,7.5 L8.5,7.5 L8.5,1.5 L2.5,1.5 Z M0.5,2.5 L7.5,2.5 L7.5,9.5 L0.5,9.5 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </button>

        <button
          className="control-btn close-btn"
          onClick={handleClose}
          title="Close"
          aria-label="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1,1 L9,9 M9,1 L1,9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
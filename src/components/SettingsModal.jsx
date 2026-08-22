import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, settingsHint, saveToken, token } = useApp();
  const [value, setValue] = useState('');

  if (!settingsOpen) return null;

  const handleSave = async () => {
    if (!value.trim()) return;
    const ok = await saveToken(value.trim());
    if (ok) setValue('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal settings-modal">
        {token && (
          <button className="modal-close" onClick={() => setSettingsOpen(false)}>
            ×
          </button>
        )}
        <div className="modal-body">
          <div className="brand-mark" style={{ marginBottom: 12 }}>
            <span className="bulb" />
            <span className="bulb" />
            <span className="bulb" />
          </div>
          <h2>Connect your TMDB account</h2>
          <p className="modal-overview">
            Paste your TMDB <strong>API Read Access Token</strong> (v4 auth) below. It's stored only on this
            machine.
          </p>
          <input
            type="password"
            className="token-input"
            placeholder="Paste your TMDB Read Access Token…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save & Continue
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => window.bridge.openExternal('https://www.themoviedb.org/settings/api')}
            >
              Get a free key ↗
            </button>
          </div>
          <p className="hint">{settingsHint}</p>
        </div>
      </div>
    </div>
  );
}

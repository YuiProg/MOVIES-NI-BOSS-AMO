const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv', label: 'TV Shows' },
  { key: 'watchlist', label: 'Watchlist' },
];

export default function Sidebar({ view, onNavigate, onOpenSettings }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <span className="bulb" />
          <span className="bulb" />
          <span className="bulb" />
        </div>
        <div className="brand-name">Xavi</div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${view === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="settings-btn" onClick={onOpenSettings}>
        Settings
      </button>
    </aside>
  );
}

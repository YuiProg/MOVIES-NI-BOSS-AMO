import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { stillUrl } from '../utils/images.js';
import {
  getRecentlyWatched,
  removeRecentlyWatched,
  clearRecentlyWatched,
  RECENTLY_WATCHED_EVENT,
} from '../utils/recentlyWatched.js';

export default function RecentlyWatched() {
  const { openEpisode } = useApp();
  const [items, setItems] = useState(getRecentlyWatched);

  useEffect(() => {
    const refresh = () => setItems(getRecentlyWatched());
    window.addEventListener(RECENTLY_WATCHED_EVENT, refresh);
    return () => window.removeEventListener(RECENTLY_WATCHED_EVENT, refresh);
  }, []);

  if (!items.length) return null;

  return (
    <section className="recently-watched">
      <div className="rw-header">
        <h3>Recently Watched</h3>
        <button className="rw-clear" onClick={clearRecentlyWatched}>
          Clear all
        </button>
      </div>

      <div className="rw-row">
        {items.map((item) => (
          <div
            key={item.key}
            className="rw-card"
            onClick={() => {
              const { episode, showTitle, id } = item.target;
              openEpisode(episode, showTitle, id);
            }}
          >
            <div
              className="rw-thumb"
              style={{ backgroundImage: `url(${stillUrl(item.still_path)})` }}
            />
            <button
              className="rw-remove"
              aria-label="Remove from recently watched"
              onClick={(e) => {
                e.stopPropagation();
                removeRecentlyWatched(item.key);
              }}
            >
              ×
            </button>
            <div className="rw-title">{item.showTitle}</div>
            <div className="rw-sub">
              S{item.season_number} · E{item.episode_number} — {item.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
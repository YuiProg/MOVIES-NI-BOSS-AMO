import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { stillUrl } from '../utils/images.js';

export default function EpisodeBrowser({ showId, showTitle, seasons }) {
  const { tmdbFetch, openEpisode } = useApp();

  // Skip "specials" (season_number 0) by default if regular seasons exist
  const seasonNumbers = (seasons || [])
    .map((s) => s.season_number)
    .filter((n) => n !== undefined)
    .sort((a, b) => a - b);
  const defaultSeason = seasonNumbers.find((n) => n > 0) ?? seasonNumbers[0] ?? 1;

  const [selectedSeason, setSelectedSeason] = useState(defaultSeason);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showId || selectedSeason === undefined) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const data = await tmdbFetch(`/tv/${showId}/season/${selectedSeason}`);
        if (cancelled) return;
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setEpisodes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showId, selectedSeason, tmdbFetch]);

  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="episode-browser">
      <div className="episode-browser-head">
        <h3>Episodes</h3>
        <select
          className="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
        >
          {seasons
            .filter((s) => s.season_number !== undefined)
            .sort((a, b) => a.season_number - b.season_number)
            .map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name || `Season ${s.season_number}`} ({s.episode_count} eps)
              </option>
            ))}
        </select>
      </div>

      {loading ? (
        <p className="empty-note">Loading episodes…</p>
      ) : episodes.length === 0 ? (
        <p className="empty-note">No episode data available for this season.</p>
      ) : (
        <div className="episode-list">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="episode-row"
              onClick={() => openEpisode(ep, showTitle, ep.id)}
            >
              <img className="episode-still" src={stillUrl(ep.still_path)} alt={ep.name} loading="lazy" />
              <div className="episode-info">
                <div className="episode-title-row">
                  <span className="episode-number">E{ep.episode_number}</span>
                  <span className="episode-name">{ep.name}</span>
                </div>
                <div className="episode-meta">
                  <span>{ep.air_date || 'TBA'}</span>
                  {ep.vote_average ? <span>★ {ep.vote_average.toFixed(1)}</span> : null}
                  {ep.runtime ? <span>{ep.runtime} min</span> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { stillUrl } from '../utils/images.js';
import { addRecentlyWatched } from '../utils/recentlyWatched.js';

export default function EpisodeModal() {
  const { episodeTarget, closeEpisode } = useApp();

  // Hooks must run before the early return below
  useEffect(() => {
    if (episodeTarget) addRecentlyWatched(episodeTarget);
  }, [episodeTarget]);

  if (!episodeTarget) return null;
  const { episode: ep, showTitle } = episodeTarget;
  const showId = ep.show_id ?? episodeTarget.id;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEpisode();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={closeEpisode}>
          ×
        </button>
        <div
          className="modal-backdrop"
          style={{ backgroundImage: `url(${stillUrl(ep.still_path)})` }}
        />
        <div className="modal-body">
          <div className="hero-eyebrow">
            {showTitle} · SEASON {ep.season_number} · EPISODE {ep.episode_number}
          </div>
          <h2>{ep.name}</h2>
          <div className="modal-meta">
            <span>{ep.air_date || 'TBA'}</span>
            {ep.vote_average ? <span className="rating">★ {ep.vote_average.toFixed(1)}</span> : null}
            {ep.runtime ? <span>{ep.runtime} min</span> : null}
          </div>
          <p className="modal-overview">{ep.overview || 'No synopsis available.'}</p>

          <div className="video-placeholder">
            <iframe
              src={`https://vidsrc.to/embed/tv/${showId}/${ep.season_number}/${ep.episode_number}`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
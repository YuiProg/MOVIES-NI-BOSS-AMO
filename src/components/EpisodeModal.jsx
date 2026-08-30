import { useApp } from '../context/AppContext.jsx';
import { stillUrl } from '../utils/images.js';

export default function EpisodeModal() {
  const { episodeTarget, closeEpisode } = useApp();

  if (!episodeTarget) return null;
  const { episode: ep, showTitle, season_number, episode_number } = episodeTarget;
  //console.log(episodeTarget, season_number, episode_number, ep);
  console.log(`https://vidsrc.sbs/embed/tv/${episodeTarget.episode.id}/${ep.season_number}/${ep.episode_number}`);
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
              src={`https://vidsrc.sbs/embed/tv/${episodeTarget.episode.id}/${ep.season_number}/${ep.episode_number}`}
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

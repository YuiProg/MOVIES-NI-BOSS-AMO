import { useApp } from '../context/AppContext.jsx';
import { posterUrl } from '../utils/images.js';

export default function Card({ item, type, removable = false }) {
  const { openDetail, removeFromWatchlist } = useApp();
  const title = item.title || item.name || 'Untitled';
  const date = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '—';

  return (
    <div className="card" onClick={() => openDetail(item.id, type)}>
      <img src={posterUrl(item.poster_path)} loading="lazy" alt={title} />
      <div className="card-info">
        <p className="card-title">{title}</p>
        <div className="card-meta">
          <span>{date || '—'}</span>
          <span className="card-rating">★ {rating}</span>
        </div>
      </div>
      {removable && (
        <button
          className="card-remove"
          title="Remove from watchlist"
          onClick={(e) => {
            e.stopPropagation();
            removeFromWatchlist(item.id, type);
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

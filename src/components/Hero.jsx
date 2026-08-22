import { useApp } from '../context/AppContext.jsx';
import { backdropUrl } from '../utils/images.js';

export default function Hero({ item }) {
  const { openDetail } = useApp();

  if (!item) {
    return <div className="hero" />;
  }

  const type = item.media_type === 'tv' ? 'tv' : 'movie';

  return (
    <div className="hero" style={{ backgroundImage: `url(${backdropUrl(item.backdrop_path)})` }}>
      <div className="hero-content">
        <div className="hero-eyebrow">NOW TRENDING</div>
        <h1 className="hero-title">{item.title || item.name}</h1>
        <p className="hero-overview">{item.overview}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => openDetail(item.id, type, { autoTrailer: true })}>
            ▸ Watch Now
          </button>
          <button className="btn btn-ghost" onClick={() => openDetail(item.id, type)}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

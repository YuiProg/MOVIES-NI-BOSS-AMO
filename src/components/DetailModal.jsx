import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { backdropUrl, profileUrl } from '../utils/images.js';
import EpisodeBrowser from './EpisodeBrowser.jsx';

export default function DetailModal() {
  const {
    detailTarget,
    closeDetail,
    tmdbFetch,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useApp();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!detailTarget) return;
    setDetails(null);
    setCredits(null);
    setTrailerKey(null);
    setShowTrailer(false);

    const kind = detailTarget.type === 'tv' ? 'tv' : 'movie';
    console.log('[DetailModal] opening', kind, 'id:', detailTarget.id);
    let cancelled = false;

    (async () => {
      try {
        const [d, c, v] = await Promise.all([
          tmdbFetch(`/${kind}/${detailTarget.id}`),
          tmdbFetch(`/${kind}/${detailTarget.id}/credits`),
          tmdbFetch(`/${kind}/${detailTarget.id}/videos`),
        ]);
        if (cancelled) return;
        setDetails(d);
        setCredits(c);
        const trailer = (v.results || []).find(
          (x) => x.site === 'YouTube' && (x.type === 'Trailer' || x.type === 'Teaser')
        );
        setTrailerKey(trailer ? trailer.key : null);
        if (detailTarget.autoTrailer && trailer) setShowTrailer(true);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [detailTarget, tmdbFetch]);

  if (!detailTarget) return null;
  const kind = detailTarget.type === 'tv' ? 'tv' : 'movie';
  const inList = details ? isInWatchlist(details.id, kind) : false;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDetail();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={closeDetail}>
          ×
        </button>
        <div
          className="modal-backdrop"
          style={{ backgroundImage: details ? `url(${backdropUrl(details.backdrop_path)})` : 'none' }}
        />
        <div className="modal-body">
          {!details ? (
            <h2>Loading…</h2>
          ) : (
            <>
              <h2>{details.title || details.name}</h2>
              <div className="modal-meta">
                <span className="rating">★ {details.vote_average ? details.vote_average.toFixed(1) : '—'}</span>
                <span>{(details.release_date || details.first_air_date || '').slice(0, 4) || '—'}</span>
                {kind === 'movie' && details.runtime ? <span>{details.runtime} min</span> : null}
                {kind === 'tv' && details.number_of_seasons ? (
                  <span>
                    {details.number_of_seasons} season{details.number_of_seasons > 1 ? 's' : ''}
                  </span>
                ) : null}
                {details.genres && details.genres.length > 0 ? (
                  <span>{details.genres.map((g) => g.name).join(', ')}</span>
                ) : null}
              </div>
              <p className="modal-overview">{details.overview || 'No synopsis available.'}</p>
              <div className="modal-cast">
                {(credits?.cast || []).slice(0, 8).map((c) => (
                  <div className="cast-member" key={c.id}>
                    <img src={profileUrl(c.profile_path)} alt={c.name} />
                    <div className="name">{c.name}</div>
                  </div>
                ))}
              </div>

              {kind === 'tv' && (
                <EpisodeBrowser showId={details.id} showTitle={details.name} seasons={details.seasons} />
              )}
              <div className="modal-actions">
                <button className="btn btn-primary" disabled={!trailerKey} onClick={() => setShowTrailer(true)}>
                  {trailerKey ? '▸ Watch Movie' : 'No movie available'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() =>
                    inList ? removeFromWatchlist(details.id, kind) : addToWatchlist(details, kind)
                  }
                >
                  {inList ? '✓ In Watchlist' : '+ Add to Watchlist'}
                </button>
              </div>
              {showTrailer && trailerKey && (
                <div className="trailer-wrap">
                  <iframe
                    src={`https://vidsrc.sbs/embed/movie/${detailTarget.id}`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Trailer"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

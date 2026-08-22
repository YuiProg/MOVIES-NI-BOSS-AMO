import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Hero from '../components/Hero.jsx';
import Grid from '../components/Grid.jsx';

export default function HomeView() {
  const { tmdbFetch, token } = useApp();
  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTv, setTopTv] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [t, m, tv] = await Promise.all([
          tmdbFetch('/trending/all/week'),
          tmdbFetch('/movie/top_rated'),
          tmdbFetch('/tv/popular'),
        ]);
        if (cancelled) return;
        setTrending(t.results.slice(0, 12));
        setTopMovies(m.results.slice(0, 12));
        setTopTv(tv.results.slice(0, 12));
        setHero(t.results.find((r) => r.backdrop_path) || t.results[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, tmdbFetch]);

  return (
    <section className="view">
      <Hero item={hero} />

      <div className="rail">
        <div className="rail-head">
          <h2>Trending This Week</h2>
        </div>
        <Grid items={trending} getType={(i) => (i.media_type === 'tv' ? 'tv' : 'movie')} />
      </div>

      <div className="rail">
        <div className="rail-head">
          <h2>Top Rated Movies</h2>
        </div>
        <Grid items={topMovies} type="movie" />
      </div>

      <div className="rail">
        <div className="rail-head">
          <h2>Popular TV Shows</h2>
        </div>
        <Grid items={topTv} type="tv" />
      </div>

      {loading && trending.length === 0 && <p className="empty-note">Loading…</p>}
    </section>
  );
}

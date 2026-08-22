import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Grid from '../components/Grid.jsx';

export default function SearchView({ query }) {
  const { tmdbFetch, token } = useApp();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!token || !query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await tmdbFetch('/search/multi', { query, include_adult: false });
        if (cancelled) return;
        setResults(data.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv'));
        setSearched(true);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, token, tmdbFetch]);

  return (
    <section className="view">
      <div className="rail-head standalone">
        <h2>Results for "{query}"</h2>
      </div>
      <Grid items={results} getType={(i) => (i.media_type === 'tv' ? 'tv' : 'movie')} />
      {!loading && searched && results.length === 0 && <p className="empty-note">No results found.</p>}
    </section>
  );
}

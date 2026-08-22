import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Grid from '../components/Grid.jsx';

export default function PagedView({ title, endpoint, type }) {
  const { tmdbFetch, token } = useApp();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadPage = useCallback(
    async (p, replace) => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await tmdbFetch(endpoint, { page: p });
        setItems((prev) => (replace ? data.results : [...prev, ...data.results]));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [tmdbFetch, endpoint, token]
  );

  useEffect(() => {
    setPage(1);
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, token]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next, false);
  };

  return (
    <section className="view">
      <div className="rail-head standalone">
        <h2>{title}</h2>
      </div>
      <Grid items={items} type={type} />
      <button className="btn btn-ghost load-more" onClick={handleLoadMore} disabled={loading}>
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </section>
  );
}

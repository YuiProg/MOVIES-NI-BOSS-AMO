import { useApp } from '../context/AppContext.jsx';
import Grid from '../components/Grid.jsx';

export default function WatchlistView() {
  const { watchlist } = useApp();

  return (
    <section className="view">
      <div className="rail-head standalone">
        <h2>Your Watchlist</h2>
      </div>
      <Grid items={watchlist} getType={(i) => i.type} removable />
      {watchlist.length === 0 && (
        <p className="empty-note">Nothing here yet. Add titles from any detail page.</p>
      )}
    </section>
  );
}

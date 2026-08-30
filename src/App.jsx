import { useState } from 'react';
import { useApp } from './context/AppContext.jsx';
import IntroAnimation from './components/IntroAnimation.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import DetailModal from './components/DetailModal.jsx';
import EpisodeModal from './components/EpisodeModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import HomeView from './views/HomeView.jsx';
import MoviesView from './views/MoviesView.jsx';
import TvView from './views/TvView.jsx';
import WatchlistView from './views/WatchlistView.jsx';
import SearchView from './views/SearchView.jsx';

export default function App() {
  const { ready, setSettingsOpen } = useApp();
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState('home');
  const [query, setQuery] = useState('');

  const handleSearch = (q) => {
    setQuery(q);
    setView(q.trim() ? 'search' : 'home');
  };

  const handleNavigate = (v) => {
    setView(v);
    setQuery('');
  };

  if (!ready) return null;

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      <div className="app">
        <Sidebar 
          view={view} 
          onNavigate={handleNavigate} 
          onOpenSettings={() => setSettingsOpen(true)} 
        />
        <main className="main">
          <TopBar query={query} onSearch={handleSearch} />
          <div className="view-scroll">
            {view === 'home' && <HomeView />}
            {view === 'movies' && <MoviesView />}
            {view === 'tv' && <TvView />}
            {view === 'watchlist' && <WatchlistView />}
            {view === 'search' && <SearchView query={query} />}
          </div>
        </main>
        <DetailModal />
        <EpisodeModal />
        <SettingsModal />
      </div>
    </>
  );
}
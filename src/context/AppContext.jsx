import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API_BASE = 'https://api.themoviedb.org/3';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [token, setToken] = useState(null);
  const [watchlist, setWatchlistState] = useState([]);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsHint, setSettingsHint] = useState('');
  const [detailTarget, setDetailTarget] = useState(null); // { id, type, autoTrailer }

  useEffect(() => {
    (async () => {
      const config = await window.bridge.getConfig();
      const wl = await window.bridge.getWatchlist();
      setWatchlistState(wl || []);
      if (config && config.token) {
        setToken(config.token);
      } else {
        setSettingsOpen(true);
      }
      setReady(true);
    })();
  }, []);

  const tmdbFetch = useCallback(async (path, params = {}) => {
    const url = new URL(API_BASE + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        setSettingsHint('Your token was rejected. Please check it and try again.');
        setSettingsOpen(true);
      }
      throw new Error(`TMDB error ${res.status}`);
    }
    const data = await res.json();
    console.log(`[TMDB] ${path}`, data);
    return data;
  }, [token]);

  const saveToken = useCallback(async (candidate) => {
    try {
      const url = new URL(API_BASE + '/authentication');
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${candidate}` },
      });
      if (!res.ok) throw new Error('rejected');
      await window.bridge.setConfig({ token: candidate });
      setToken(candidate);
      setSettingsHint('');
      setSettingsOpen(false);
      return true;
    } catch (err) {
      setSettingsHint('That token was rejected by TMDB. Double-check it and try again.');
      return false;
    }
  }, []);

  const isInWatchlist = useCallback(
    (id, type) => watchlist.some((w) => w.id === id && w.type === type),
    [watchlist]
  );

  const addToWatchlist = useCallback(async (item, type) => {
    setWatchlistState((prev) => {
      const next = [...prev, {
        id: item.id,
        type,
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
      }];
      window.bridge.setWatchlist(next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback(async (id, type) => {
    setWatchlistState((prev) => {
      const next = prev.filter((w) => !(w.id === id && w.type === type));
      window.bridge.setWatchlist(next);
      return next;
    });
  }, []);

  const openDetail = useCallback((id, type, opts = {}) => {
    setDetailTarget({ id, type, ...opts });
  }, []);

  const closeDetail = useCallback(() => setDetailTarget(null), []);

  const value = {
    token,
    ready,
    tmdbFetch,
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    settingsOpen,
    setSettingsOpen,
    settingsHint,
    saveToken,
    detailTarget,
    openDetail,
    closeDetail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
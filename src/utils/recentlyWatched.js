const KEY = 'recentlyWatched';
const MAX = 20;
export const RECENTLY_WATCHED_EVENT = 'recently-watched-changed';

function save(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or unavailable */
  }
  window.dispatchEvent(new Event(RECENTLY_WATCHED_EVENT));
}

export function getRecentlyWatched() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// target = { episode, showTitle, id } (same shape as episodeTarget in AppContext)
export function addRecentlyWatched(target) {
  const { episode: ep, showTitle, id } = target;
  const showId = ep.show_id ?? id;

  const entry = {
    key: `${showId}-${ep.season_number}-${ep.episode_number}`,
    watchedAt: Date.now(),
    target: { episode: ep, showTitle, id: showId },
    showTitle,
    name: ep.name,
    season_number: ep.season_number,
    episode_number: ep.episode_number,
    still_path: ep.still_path,
  };

  const list = [entry, ...getRecentlyWatched().filter((e) => e.key !== entry.key)].slice(0, MAX);
  save(list);
}

export function removeRecentlyWatched(key) {
  save(getRecentlyWatched().filter((e) => e.key !== key));
}

export function clearRecentlyWatched() {
  save([]);
}
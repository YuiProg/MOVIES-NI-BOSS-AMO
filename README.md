# Marquee — a TMDB desktop browser (practice project)

An Electron + React (Vite) desktop app for browsing trending movies & TV shows,
searching, viewing details/cast, watching official trailers, and keeping a local
watchlist — all powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

**Important:** TMDB provides *metadata* (posters, synopses, cast, ratings) and links to
*official YouTube trailers*. It does not provide full movies/episodes to stream, so this
app is a browse/discover experience, not a place to watch full content.

## Setup

1. Install [Node.js](https://nodejs.org) (v18+) if you don't have it.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the React app and launch Electron:
   ```bash
   npm start
   ```
   This runs a one-off `vite build` and then opens the Electron window. If you're
   actively editing the UI, use `npm run dev` instead — it starts the Vite dev server
   with hot reload and points Electron at it.
4. On first launch you'll be asked for a TMDB **API Read Access Token**:
   - Create a free account at https://www.themoviedb.org
   - Go to **Settings → API** and request a key (choose "Developer", personal use)
   - Copy the long **"API Read Access Token"** (v4 auth, starts with `eyJ...`) — not the
     short v3 API key
   - Paste it into the app's setup screen (there's also a "Get a free key" button that
     opens the TMDB page for you)

Your token and watchlist are stored locally in your OS's app-data folder
(`app.getPath('userData')`), never bundled or sent anywhere except directly to TMDB.

## Features

- **Home** — hero spotlight + trending/top-rated/popular rails
- **Movies / TV Shows** — paginated browsing ("Load more")
- **Search** — debounced live search across movies & TV
- **Details modal** — synopsis, cast, rating, genres, and trailer playback
- **Watchlist** — add/remove titles, persisted to disk between launches

## Project structure

```
tmdb-streamer/
├── main.js               # Electron main process (window, IPC, file persistence)
├── preload.js            # contextBridge-exposed API for the renderer
├── index.html            # Vite HTML entry (mounts the React app)
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx          # React root render
    ├── App.jsx           # Top-level layout & view routing
    ├── styles.css        # Cinematic theme
    ├── context/
    │   └── AppContext.jsx   # TMDB fetch helper, token, watchlist, modal state
    ├── components/
    │   ├── Sidebar.jsx, TopBar.jsx, Hero.jsx, Card.jsx, Grid.jsx
    │   ├── DetailModal.jsx
    │   └── SettingsModal.jsx
    ├── views/
    │   ├── HomeView.jsx, PagedView.jsx, MoviesView.jsx, TvView.jsx
    │   ├── WatchlistView.jsx
    │   └── SearchView.jsx
    └── utils/
        └── images.js
```

React state is shared via a single `AppContext` (token, watchlist, the TMDB fetch
helper, and the open detail-modal target) rather than prop-drilling through every
view — `useApp()` gives any component access to it.

## Notes for extending this practice project

- Swap TMDB's YouTube trailer with a real streaming backend if you ever want actual
  video playback (that's a separate licensing/legal undertaking, out of scope here).
- Add `electron-builder` if you want to package installers (.dmg/.exe/.AppImage).
- Consider adding genre filters, a "similar titles" rail, or seasons/episodes browsing
  for TV shows using `/tv/{id}/season/{season_number}`.

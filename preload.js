const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (data) => ipcRenderer.invoke('config:set', data),
  getWatchlist: () => ipcRenderer.invoke('watchlist:get'),
  setWatchlist: (data) => ipcRenderer.invoke('watchlist:set', data),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
});

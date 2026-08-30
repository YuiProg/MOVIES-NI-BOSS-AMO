const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (data) => ipcRenderer.invoke('config:set', data),
  getWatchlist: () => ipcRenderer.invoke('watchlist:get'),
  setWatchlist: (data) => ipcRenderer.invoke('watchlist:set', data),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  // Window Controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  onMaximized: (callback) => {
    const subscription = (_event, isMaximized) => callback(isMaximized);
    ipcRenderer.on('window:maximized', subscription);
    return () => ipcRenderer.removeListener('window:maximized', subscription);
  }
});
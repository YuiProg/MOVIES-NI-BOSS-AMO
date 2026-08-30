const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');
const WATCHLIST_PATH = path.join(app.getPath('userData'), 'watchlist.json');


/* ============================================================
   JSON HELPERS
   ============================================================ */

function readJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;

    const raw = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read', filePath, err);

    return fallback;
  }
}


function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    return true;
  } catch (err) {
    console.error('Failed to write', filePath, err);

    return false;
  }
}


/* ============================================================
   MAIN WINDOW
   ============================================================ */

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 620,
    backgroundColor: '#050506',

    frame: false, // <-- Change this to false for full custom window controls

    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });


  /* ==========================================================
     LOAD APPLICATION
     ========================================================== */

  const devServerUrl =
    process.env.ELECTRON_START_URL;

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(
      path.join(
        __dirname,
        'dist',
        'index.html'
      )
    );
  }


  /* ==========================================================
     DEVTOOLS
     ========================================================== */

  // Remove this line when you don't want
  // DevTools to open automatically.
  //mainWindow.webContents.openDevTools();


  /* ==========================================================
     WINDOW EVENTS
     ========================================================== */

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send(
      'window:maximized',
      true
    );
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send(
      'window:maximized',
      false
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


/* ============================================================
   APP LIFECYCLE
   ============================================================ */

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);

  createWindow();

  app.on('activate', () => {
    if (
      BrowserWindow.getAllWindows().length === 0
    ) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


/* ============================================================
   IPC — WINDOW CONTROLS
   ============================================================ */

ipcMain.handle(
  'window:minimize',
  (event) => {
    const window =
      BrowserWindow.fromWebContents(
        event.sender
      );

    if (window) {
      window.minimize();
    }
  }
);


ipcMain.handle(
  'window:maximize',
  (event) => {
    const window =
      BrowserWindow.fromWebContents(
        event.sender
      );

    if (!window) return;

    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
);


ipcMain.handle(
  'window:close',
  (event) => {
    const window =
      BrowserWindow.fromWebContents(
        event.sender
      );

    if (window) {
      window.close();
    }
  }
);


ipcMain.handle(
  'window:isMaximized',
  (event) => {
    const window =
      BrowserWindow.fromWebContents(
        event.sender
      );

    return window
      ? window.isMaximized()
      : false;
  }
);


/* ============================================================
   IPC — CONFIG
   ============================================================ */

ipcMain.handle(
  'config:get',
  () => readJSON(CONFIG_PATH, {})
);


ipcMain.handle(
  'config:set',
  (_evt, data) =>
    writeJSON(
      CONFIG_PATH,
      data
    )
);


/* ============================================================
   IPC — WATCHLIST
   ============================================================ */

ipcMain.handle(
  'watchlist:get',
  () =>
    readJSON(
      WATCHLIST_PATH,
      []
    )
);


ipcMain.handle(
  'watchlist:set',
  (_evt, data) =>
    writeJSON(
      WATCHLIST_PATH,
      data
    )
);


/* ============================================================
   IPC — EXTERNAL LINKS
   ============================================================ */

ipcMain.handle(
  'shell:openExternal',
  (_evt, url) => {
    if (
      typeof url === 'string' &&
      /^https?:\/\//.test(url)
    ) {
      shell.openExternal(url);
    }
  }
);
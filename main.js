
const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Menu,
    session
} = require('electron');

const path = require('path');
const fs = require('fs');

const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch');

// ============================================================
// FILE PATHS
// ============================================================

const CONFIG_PATH = path.join(
    app.getPath('userData'),
    'config.json'
);

const WATCHLIST_PATH = path.join(
    app.getPath('userData'),
    'watchlist.json'
);

// ============================================================
// JSON HELPERS
// ============================================================

function readJSON(filePath, fallback) {
    try {
        if (!fs.existsSync(filePath)) {
            return fallback;
        }

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

// ============================================================
// AD BLOCKER
// ============================================================

let adBlocker = null;
let adBlockerPromise = null;


async function enableAdBlocker() {
    if (adBlocker) {
        return true;
    }

    if (!adBlockerPromise) {
        adBlockerPromise = (async () => {
            try {
                console.log('Initializing ad blocker...');

                adBlocker =
                    await ElectronBlocker.fromPrebuiltAdsAndTracking(
                        fetch
                    );

                // Disable cosmetic filtering to avoid the
                // unsupported registerPreloadScript() API.
                adBlocker.config.loadCosmeticFilters = false;

                // Keep network-level ad and tracker blocking.
                adBlocker.enableBlockingInSession(
                    session.defaultSession
                );

                console.log(
                    'Ad blocker enabled successfully (network filtering only).'
                );

                return true;
            } catch (error) {
                console.error(
                    'Failed to initialize ad blocker:',
                    error
                );

                adBlocker = null;
                adBlockerPromise = null;

                return false;
            }
        })();
    }

    return adBlockerPromise;
}


// ============================================================
// MAIN WINDOW
// ============================================================

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 960,
        minHeight: 620,

        backgroundColor: '#050506',

        frame: false,
        autoHideMenuBar: true,

        icon: path.join(
            __dirname,
            'build',
            'icon.png'
        ),

        webPreferences: {
            preload: path.join(
                __dirname,
                'preload.js'
            ),

            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    // ========================================================
    // LOAD APPLICATION
    // ========================================================

    const devServerUrl = process.env.ELECTRON_START_URL;

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

    // ========================================================
    // DEVTOOLS
    // ========================================================

    // Uncomment during development if needed:
    // mainWindow.webContents.openDevTools();

    // ========================================================
    // WINDOW EVENTS
    // ========================================================

    mainWindow.on('maximize', () => {
        mainWindow?.webContents.send(
            'window:maximized',
            true
        );
    });

    mainWindow.on('unmaximize', () => {
        mainWindow?.webContents.send(
            'window:maximized',
            false
        );
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ============================================================
// APP LIFECYCLE
// ============================================================

app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);

    // Attempt to enable blocking before creating the window.
    // The application still starts if initialization fails.
    await enableAdBlocker();

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ============================================================
// IPC — WINDOW CONTROLS
// ============================================================

ipcMain.handle('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(
        event.sender
    );

    if (window) {
        window.minimize();
    }
});

ipcMain.handle('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(
        event.sender
    );

    if (!window) {
        return;
    }

    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});

ipcMain.handle('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(
        event.sender
    );

    if (window) {
        window.close();
    }
});

ipcMain.handle('window:isMaximized', (event) => {
    const window = BrowserWindow.fromWebContents(
        event.sender
    );

    return window
        ? window.isMaximized()
        : false;
});

// ============================================================
// IPC — CONFIG
// ============================================================

ipcMain.handle('config:get', () => {
    return readJSON(CONFIG_PATH, {});
});

ipcMain.handle('config:set', (_evt, data) => {
    return writeJSON(CONFIG_PATH, data);
});

// ============================================================
// IPC — WATCHLIST
// ============================================================

ipcMain.handle('watchlist:get', () => {
    return readJSON(WATCHLIST_PATH, []);
});

ipcMain.handle('watchlist:set', (_evt, data) => {
    return writeJSON(WATCHLIST_PATH, data);
});

// ============================================================
// IPC — EXTERNAL LINKS
// ============================================================

ipcMain.handle('shell:openExternal', (_evt, url) => {
    if (
        typeof url === 'string' &&
        /^https?:\/\//i.test(url)
    ) {
        return shell.openExternal(url);
    }
});

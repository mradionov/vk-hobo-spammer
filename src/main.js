const { app, BrowserWindow, ipcMain } = require('electron');

const VKAuthService = require('./services/VKAuthService');

const Cache = require('./lib/Cache');

const { isDev } = require('./config/env');
const { CACHE_PATH } = require('./config/paths');
const { VK_APP_ID } = require('./config/secrets');

const cache = new Cache({ path: CACHE_PATH });
const authService = new VKAuthService({ appId: VK_APP_ID });

let window;

app.on('ready', () => {
  const url = `file://${__dirname}/renderer/index.html`;
  window = new BrowserWindow();
  window.loadURL(url);
  window.maximize();

  if (isDev()) {
    window.webContents.openDevTools();
  }
});

ipcMain.on('app:renderer/ready', async () => {
  await cache.load();
  const state = cache.get('state') || {};

  window.webContents.send('app:main/state/update', state);
});

ipcMain.on('app:renderer/state/update', async (ev, state) => {
  cache.set('state', state);
  await cache.save();
});

ipcMain.on('app:auth/login/request', async () => {
  try {
    const token = await authService.authorize();

    window.webContents.send('app:auth/login/success', token);
  } catch (err) {
    window.webContents.send('app:auth/login/failure', err);
  }
});

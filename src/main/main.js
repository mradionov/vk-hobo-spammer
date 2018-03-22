const { app, BrowserWindow, ipcMain } = require('electron');

const authorize = require('./authorize');
const Cache = require('./lib/Cache');
const { isDev } = require('../config/env');
const { CACHE_PATH } = require('../config/config');

const cache = new Cache(CACHE_PATH);

let window;

app.on('ready', () => {
  const url = `file://${__dirname}/../renderer/index.html`;
  window = new BrowserWindow();
  window.loadURL(url);

  if (isDev()) {
    window.maximize();
    window.webContents.openDevTools();
  }
});

ipcMain.on('app:renderer/ready', async () => {
  await cache.load();
  const token = cache.get('token');

  if (token === undefined) {
    window.webContents.send('app:auth/login/guest');
  } else {
    window.webContents.send('app:auth/login/success', token);
  }
});

ipcMain.on('app:auth/login/request', async () => {
  try {
    const token = await authorize();

    cache.set('token', token);
    await cache.save();

    window.webContents.send('app:auth/login/success', token);
  } catch (err) {
    window.webContents.send('app:auth/login/failure', err);
  }
});

ipcMain.on('app:auth/logout/request', async () => {
  cache.remove('token');
  await cache.save();

  window.webContents.send('app:auth/logout/success');
});

ipcMain.on('app:jobs/index/request', () => {

});

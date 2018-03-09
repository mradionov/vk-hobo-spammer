const electron = require('electron');

const authorize = require('./authorize');
const Cache = require('./lib/Cache');
const { CACHE_PATH } = require('./config');

const cache = new Cache(CACHE_PATH);

let window;

electron.app.on('ready', () => {
  const windowUrl = `file://${__dirname}/renderer/index.html`;
  window = new electron.BrowserWindow();
  window.loadURL(windowUrl);
  window.maximize();
  window.webContents.openDevTools();
});

electron.ipcMain.on('hobo:ready', async () => {
  await cache.load();
  const token = cache.get('token');

  if (token === undefined) {
    window.webContents.send('hobo:auth/login/guest');
  } else {
    window.webContents.send('hobo:auth/login/success', token);
  }
});

electron.ipcMain.on('hobo:auth/login/request', async () => {
  try {
    const token = await authorize();

    cache.set('token', token);
    await cache.save();

    window.webContents.send('hobo:auth/login/success', token);
  } catch (err) {
    window.webContents.send('hobo:auth/login/failure', err);
  }
});

electron.ipcMain.on('hobo:auth/logout/request', async () => {
  cache.remove('token');
  await cache.save();

  window.webContents.send('hobo:auth/logout/success');
});

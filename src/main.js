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
  window.webContents.openDevTools();
});

electron.ipcMain.on('hobo:ready', async () => {
  console.log('ready');
  await cache.load();
  const token = cache.get('token');

  console.log({ token });

  window.webContents.send('hobo:token', token);
});

electron.ipcMain.on('hobo:authorize', async () => {
  const token = await authorize();

  cache.set('token', token);
  await cache.save();

  window.webContents.send('hobo:token', token);
});

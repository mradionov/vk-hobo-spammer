const { app, BrowserWindow, ipcMain } = require('electron');

const VKAuthService = require('./services/VKAuthService');
const MessageService = require('./services/MessageService');
const Cache = require('./lib/Cache');
const { isDev } = require('./config/env');
const {
  CACHE_PATH,
  MESSAGES_INDEX_PATH, MESSAGES_DIR_PATH,
} = require('./config/paths');
const { VK_APP_ID } = require('./config/secrets');

const cache = new Cache({ path: CACHE_PATH });
const authService = new VKAuthService({ appId: VK_APP_ID });
const messageService = new MessageService({
  indexPath: MESSAGES_INDEX_PATH,
  dirPath: MESSAGES_DIR_PATH,
});

let window;

app.on('ready', () => {
  const url = `file://${__dirname}/renderer/index.html`;
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
    const token = await authService.authorize();

    cache.set('token', token);
    await cache.save();

    window.webContents.send('app:auth/login/success', token);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:auth/login/failure', err);
  }
});

ipcMain.on('app:auth/logout/request', async () => {
  cache.remove('token');
  await cache.save();

  window.webContents.send('app:auth/logout/success');
});

ipcMain.on('app:messages/index/request', async () => {
  const messages = await messageService.getIndex();
  window.webContents.send('app:messages/index/success', messages);
});

ipcMain.on('app:messages/get/request', async (ev, messageId) => {
  try {
    const message = await messageService.get(messageId);
    window.webContents.send('app:messages/get/success', message);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:messages/get/failure', err);
  }
});

ipcMain.on('app:messages/create/request', async (ev, data) => {
  try {
    const message = await messageService.create(data);
    window.webContents.send('app:messages/create/success', message);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:messages/create/failure', err);
  }
});

ipcMain.on('app:messages/update/request', async (ev, messageId, data) => {
  try {
    const message = await messageService.update(messageId, data);
    window.webContents.send('app:messages/update/success', message);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:messages/update/failure', err);
  }
});

ipcMain.on('app:messages/remove/request', async (ev, messageId) => {
  try {
    await messageService.remove(messageId);
    window.webContents.send('app:messages/remove/success');
  } catch (err) {
    console.error(err);
    window.webContents.send('app:messages/remove/failure');
  }
});

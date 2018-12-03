const { app, BrowserWindow, ipcMain } = require('electron');

const VKAuthService = require('./services/VKAuthService');
const MessageRepository = require('./repositories/MessageRepository');
const PostRepository = require('./repositories/PostRepository');
const Cache = require('./lib/Cache');
const { isDev } = require('./config/env');
const {
  CACHE_PATH, MESSAGE_INDEX_PATH, POST_INDEX_PATH,
} = require('./config/paths');
const { VK_APP_ID } = require('./config/secrets');

const cache = new Cache({ path: CACHE_PATH });
const authService = new VKAuthService({ appId: VK_APP_ID });
const messageRepository = new MessageRepository({
  indexPath: MESSAGE_INDEX_PATH,
});
const postRepository = new PostRepository({
  indexPath: POST_INDEX_PATH,
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

ipcMain.on('app:message/index/request', async () => {
  const messages = await messageRepository.getIndex();
  window.webContents.send('app:message/index/success', messages);
});

ipcMain.on('app:message/get/request', async (ev, messageId) => {
  try {
    const message = await messageRepository.get(messageId);
    window.webContents.send('app:message/get/success', message);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:message/get/failure', err);
  }
});

ipcMain.on('app:message/create/request', async (ev, data) => {
  try {
    const message = await messageRepository.create(data);
    window.webContents.send('app:message/create/success', message);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:message/create/failure', err);
  }
});

ipcMain.on('app:message/update/request', async (ev, messageId, data) => {
  try {
    const message = await messageRepository.update(messageId, data);
    window.webContents.send('app:message/update/success', message);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:message/update/failure', err);
  }
});

ipcMain.on('app:message/remove/request', async (ev, messageId) => {
  try {
    await messageRepository.remove(messageId);
    window.webContents.send('app:message/remove/success');
  } catch (err) {
    console.error(err);
    window.webContents.send('app:message/remove/failure');
  }
});

ipcMain.on('app:post/index/request', async (ev, messageId) => {
  const posts = await postRepository.getIndexByMessage(messageId);
  window.webContents.send('app:post/index/success', posts);
});

ipcMain.on('app:post/create/request', async (ev, data) => {
  try {
    const post = await postRepository.create(data);
    window.webContents.send('app:post/create/success', post);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:post/create/failure', err);
  }
});

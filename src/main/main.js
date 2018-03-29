const { app, BrowserWindow, ipcMain } = require('electron');

const VKAuthService = require('./services/VKAuthService');
const JobService = require('./services/JobService');
const Cache = require('./lib/Cache');
const { isDev } = require('../config/env');
const { CACHE_PATH, JOBS_INDEX_PATH, JOBS_DIR_PATH } = require('../config/paths');
const { VK_APP_ID } = require('../config/secrets');

const cache = new Cache({ path: CACHE_PATH });
const authService = new VKAuthService({ appId: VK_APP_ID });
const jobService = new JobService({
  indexPath: JOBS_INDEX_PATH,
  dirPath: JOBS_DIR_PATH,
});

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

ipcMain.on('app:jobs/index/request', async () => {
  const jobs = await jobService.getIndex();
  window.webContents.send('app:jobs/index/success', jobs);
});

ipcMain.on('app:jobs/get/request', async (ev, jobId) => {
  try {
    const job = await jobService.get(jobId);
    window.webContents.send('app:jobs/get/success', job);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:jobs/get/failure', err);
  }
});

ipcMain.on('app:jobs/create/request', async (ev, data) => {
  try {
    const job = await jobService.create(data);
    window.webContents.send('app:jobs/create/success', job);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:jobs/create/failure', err);
  }
});

ipcMain.on('app:jobs/update/request', async (ev, jobId, data) => {
  try {
    const job = await jobService.update(jobId, data);
    window.webContents.send('app:jobs/update/success', job);
  } catch (err) {
    console.error(err);
    window.webContents.send('app:jobs/update/failure', err);
  }
});

ipcMain.on('app:jobs/remove/request', async (ev, jobId) => {
  try {
    await jobService.remove(jobId);
    window.webContents.send('app:jobs/remove/success');
  } catch (err) {
    console.error(err);
    window.webContents.send('app:jobs/remove/failure');
  }
});

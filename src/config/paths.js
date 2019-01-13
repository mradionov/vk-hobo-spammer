const path = require('path');

const electron = require('electron');

const userDataPath = electron.app.getPath('userData');
const appPath = path.join(userDataPath, 'app');
const dbPath = path.join(appPath, 'db');

exports.APP_PATH = appPath;
exports.CACHE_GENERAL_PATH = path.join(appPath, 'cache.json');
exports.CACHE_QUEUE_PATH = path.join(appPath, 'queue.json');
exports.DB_MESSAGES_PATH = path.join(dbPath, 'messages.db');
exports.DB_BUNDLES_PATH = path.join(dbPath, 'bundles.db');
exports.DB_POSTS_PATH = path.join(dbPath, 'posts.db');

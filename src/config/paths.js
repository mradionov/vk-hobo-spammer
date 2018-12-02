const path = require('path');

const electron = require('electron');

const userDataPath = electron.app.getPath('userData');
const appPath = path.join(userDataPath, 'app');

exports.CACHE_PATH = path.join(appPath, 'cache.json');
exports.MESSAGES_INDEX_PATH = path.join(appPath, 'messages.json');
exports.MESSAGES_DIR_PATH = path.join(appPath, 'messages');

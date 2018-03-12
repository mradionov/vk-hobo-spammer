const path = require('path');

const electron = require('electron');

const secrets = require('./secrets');

const userDataPath = electron.app.getPath('userData');

exports.CACHE_PATH = path.join(userDataPath, 'cache.json');
exports.VK_APP_ID = secrets.VK_APP_ID;

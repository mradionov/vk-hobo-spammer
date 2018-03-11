const path = require('path');

const electron = require('electron');

exports.USER_DATA_PATH = electron.app.getPath('userData');
exports.CACHE_PATH = path.join(this.USER_DATA_PATH, 'cache.json');

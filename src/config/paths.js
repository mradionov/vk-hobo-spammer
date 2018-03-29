const path = require('path');

const electron = require('electron');

const userDataPath = electron.app.getPath('userData');
const appPath = path.join(userDataPath, 'app');

exports.CACHE_PATH = path.join(appPath, 'cache.json');
exports.JOBS_INDEX_PATH = path.join(appPath, 'jobs.json');
exports.JOBS_DIR_PATH = path.join(appPath, 'jobs');

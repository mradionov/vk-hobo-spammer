const electron = require('electron');

exports.isProd = () => electron.app.isPackaged;
exports.isDev = () => !this.isProd();

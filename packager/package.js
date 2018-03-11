const path = require('path');

const packager = require('electron-packager');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const options = {
  dir: rootDir,
  out: distDir,
  arch: 'x64',
  ignore: [
    /node_modules/,
  ],
  overwrite: true,
  platform: [
    'linux',
    'win32',
  ],
};

packager(options, (err, appPaths) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Done: ', appPaths);
  }
});

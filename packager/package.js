const path = require('path');

const packager = require('electron-packager');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const options = {
  dir: rootDir,
  out: distDir,
  arch: 'x64',
  asar: true,
  overwrite: true,
  platform: [
    'linux',
    'win32',
  ],
};

packager(options, (err, appPaths) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } else {
    // eslint-disable-next-line no-console
    console.log('Done: ', appPaths);
  }
});

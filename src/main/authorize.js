const qs = require('querystring');
const url = require('url');

const electron = require('electron');

const REDIRECT_URI = 'https://oauth.vk.com/blank.html';

module.exports = () => {
  const queryParams = {
    client_id: '6397528',
    scope: 'friends,messages',
    redirect_uri: REDIRECT_URI,
    display: 'page',
    v: '5.73',
    response_type: 'token',
  };
  const queryString = qs.stringify(queryParams);
  const windowUrl = `https://oauth.vk.com/authorize?${queryString}`;

  const window = new electron.BrowserWindow();
  window.loadURL(windowUrl);

  return new Promise((resolve, reject) => {
    window.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      if (!newUrl.startsWith(REDIRECT_URI)) {
        return;
      }

      const responseUrl = url.parse(newUrl);
      const { hash } = responseUrl;
      const hashClean = hash.slice(1, hash.length);
      const hashParams = qs.parse(hashClean);

      if (hashParams.error !== undefined) {
        reject(hashParams);
        window.close();
        return;
      }

      const token = hashParams.access_token;

      resolve(token);
      window.close();
    });
  });
};

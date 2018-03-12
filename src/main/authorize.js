const queryStringHelper = require('querystring');
const urlHelper = require('url');

const electron = require('electron');

const Deferred = require('./lib/Deferred');
const { VK_APP_ID } = require('../config/config');

const REDIRECT_URI = 'https://oauth.vk.com/blank.html';

const authorize =  () => {
  const deferred = new Deferred();

  const queryParams = {
    client_id: VK_APP_ID,
    display: 'page',
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: 'friends,messages',
    v: '5.73',
  };
  const queryString = queryStringHelper.stringify(queryParams);
  const url = `https://oauth.vk.com/authorize?${queryString}`;

  const window = new electron.BrowserWindow();
  window.loadURL(url);
  window.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    if (!newUrl.startsWith(REDIRECT_URI)) {
      return;
    }

    const responseUrl = urlHelper.parse(newUrl);
    const { hash } = responseUrl;
    const hashClean = hash.slice(1, hash.length);
    const hashParams = queryStringHelper.parse(hashClean);

    if (hashParams.error !== undefined) {
      deferred.reject(hashParams);
      window.close();
      return;
    }

    const token = hashParams.access_token;

    deferred.resolve(token);
    window.close();
  });

  return deferred.promise;
};

module.exports = authorize;

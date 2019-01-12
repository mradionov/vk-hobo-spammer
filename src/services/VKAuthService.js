const queryStringHelper = require('querystring');
const urlHelper = require('url');

const electron = require('electron');
const session = electron.session;

const Deferred = require('../lib/Deferred');

const REDIRECT_URI = 'https://oauth.vk.com/blank.html';

class VKAuthService {
  constructor(options = { appId: '' }) {
    this.options = options;
  }

  authorize() {
    const deferred = new Deferred();

    const queryParams = {
      client_id: this.options.appId,
      display: 'page',
      redirect_uri: REDIRECT_URI,
      response_type: 'token',
      scope: 'friends,messages,photos',
      v: '5.73',
    };
    const queryString = queryStringHelper.stringify(queryParams);
    const url = `https://oauth.vk.com/authorize?${queryString}`;

    const window = new electron.BrowserWindow();
    window.loadURL(url);

    const filter = {
      urls: [REDIRECT_URI],
    };

    session.defaultSession.webRequest.onCompleted(filter, (details) => {
      const responseUrl = urlHelper.parse(details.url);
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
  }
}

module.exports = VKAuthService;

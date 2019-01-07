const https = require('https');
const querystring = require('querystring');
const { URL } = require('url');

const { defaultsDeep } = require('lodash');

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

class HTTPService {

  constructor(defaultConfig = {}) {
    this.defaultConfig = defaultsDeep(defaultConfig, {
      baseURL: '',
      headers: {},
      params: {},
      data: null,
    });

    this.configInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
  }

  addConfigInterceptor(interceptor) {
    this.configInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor) {
    this.errorInterceptors.push(interceptor);
  }

  async get(url, config) {
    return this.request(METHOD_GET, url, config);
  }

  async post(url, config) {
    return this.request(METHOD_POST, url, config);
  }

  async request(method, pathname, requestConfig = {}) {
    let config = defaultsDeep({}, requestConfig, this.defaultConfig);

    this.configInterceptors.forEach((interceptor) => {
      config = interceptor(config);
    });

    let url = [
      config.baseURL,
      pathname,
    ].join('/');

    let promise = new Promise((resolve, reject) => {
      const urlObject = new URL(url);

      const {
        params = {},
        headers = {},
        data = null,
      } = config;

      let path = urlObject.pathname;
      if (Object.keys(params).length > 0) {
        const queryString = querystring.stringify(params);
        path += `?${queryString}`;
      }

      const dataURLEncoded = data && querystring.stringify(data);

      if (method === METHOD_POST && data !== null) {
        Object.assign(headers, {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(dataURLEncoded),
        });
      }

      const options = {
        headers,
        hostname: urlObject.hostname,
        method,
        path,
        port: urlObject.port,
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const dataParsed = JSON.parse(data);

          const response = {
            status: res.statusCode,
            data: dataParsed,
          };

          resolve(response);
        });

      });

      req.on('error', (err) => {
        console.error(err);
        reject(err);
      });

      if (method === METHOD_POST && data !== null) {
        req.write(dataURLEncoded);
      }

      req.end();
    });

    this.responseInterceptors.forEach((interceptor) => {
      promise = promise.then(interceptor);
    });

    this.errorInterceptors.forEach((interceptor) => {
      promise = promise.catch(interceptor);
    });

    return promise;
  }

}

module.exports = HTTPService;

import queryStringHelper from 'querystring';

import { defaultsDeep } from 'lodash';

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

class HTTPClient {
  constructor(defaultOptions = {}) {
    this.defaultOptions = defaultsDeep(defaultOptions, {
      baseURL: '',
      headers: {},
      params: {},
      data: {},
    });

    this.optionsInterceptors = [];
  }

  addOptionsInterceptor(interceptor) {
    this.optionsInterceptors.push(interceptor);
  }

  async get(pathname, options) {
    return this.request(METHOD_GET, pathname, options);
  }

  async post(pathname, options) {
    return this.request(METHOD_POST, pathname, options);
  }

  async request(method, pathname, requestOptions = {}) {
    let options = defaultsDeep({}, requestOptions, this.defaultOptions);

    this.optionsInterceptors.forEach((interceptor) => {
      options = interceptor(options);
    });

    let url = [options.baseURL, pathname].join('/');
    const queryString = queryStringHelper.stringify(options.params);
    if (queryString.length > 0) {
      url += `?${queryString}`;
    }

    const headers = options.headers;

    let body = null;

    if (method === METHOD_POST) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = queryStringHelper.stringify(options.data);
    }

    const fetchOptions = {
      body,
      headers,
      method,
    };

    console.log({ fetchOptions });

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return data;
  }
}

export default HTTPClient;

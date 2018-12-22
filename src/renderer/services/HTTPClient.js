import queryStringHelper from 'querystring';

import { defaultsDeep } from 'lodash';

const METHOD_GET = 'GET';

class HTTPClient {
  constructor(defaultOptions = {}) {
    this.defaultOptions = defaultsDeep(defaultOptions, {
      baseURL: '',
      method: METHOD_GET,
      params: {},
    });

    this.optionsInterceptors = [];
  }

  addOptionsInterceptor(interceptor) {
    this.optionsInterceptors.push(interceptor);
  }

  async get(pathname, options) {
    return this.request(METHOD_GET, pathname, options);
  }

  async request(method, pathname, requestOptions = {}) {
    let options = defaultsDeep({}, requestOptions, this.defaultOptions, {
      method,
      pathname,
    });

    this.optionsInterceptors.forEach((interceptor) => {
      options = interceptor(options);
    });

    let url = [options.baseURL, options.pathname].join('/');
    const queryString = queryStringHelper.stringify(options.params);
    if (queryString.length > 0) {
      url += `?${queryString}`;
    }

    const fetchOptions = {
      method: options.method,
    };

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return data;
  }
}

export default HTTPClient;

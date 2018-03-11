(() => {
  const qs = require('querystring');

  const defaults = (object = {}, source = {}) => {
    const result = {};

    Object.keys(object).forEach((key) => {
      result[key] = object[key];
    });

    Object.keys(source).forEach((key) => {
      if (result[key] === undefined) {
        result[key] = source[key];
      }
    });

    return result;
  };

  class Request {
    constructor(options = {}) {
      this.options = defaults(options, {
        base: '',
        params: {},
      });
    }

    appendParams(params = {}) {
      Object.keys(params).forEach((key) => {
        this.options.params[key] = params[key];
      });
    }

    async get(pathname, requestOptions = {}) {
      const options = defaults(requestOptions, this.options);
      const params = defaults(options.params, this.options.params);

      let url = [
        options.base,
        pathname,
      ].join('/');

      const queryString = qs.stringify(params);
      if (queryString.length > 0) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      return data;
    }
  }

  window.vhs.lib.Request = Request;
})();

// https://vk.com/dev/errors

const NAMESPACES = {
  vk: 'vk',
};

const VK_ERROR_CODES = {
  10: 'Internal server error. Try again later. ' +
    'Probably message with this id is already sent to the user.',
  914: 'Message is too long',
};

const HTTP_ERROR_CODES = {
  400: 'Bad request',
  401: 'Not authenticated',
  403: 'Not authorized',
  404: 'Not found',
  500: 'Server error',
};

const errorHelper = {

  getMessageFromCode(fullCode) {
    const [namespace, code] = fullCode.split(':');

    if (namespace === NAMESPACES.vk) {
      return this.getMessageFromVKCode(fullCode, code);
    }

    return this.getMessageFromHTTPCode(fullCode, code);
  },

  getMessageFromVKCode(fullCode, code) {
    let message = `[${fullCode}] `;
    message += (VK_ERROR_CODES[code] || 'Unknown VK error');

    return message;
  },

  getMessageFromHTTPCode(fullCode, code) {
    let message = `[${fullCode}] `;
    message += (HTTP_ERROR_CODES[code] || 'Unknown HTTP error')

    return message;
  },

};

export default errorHelper;

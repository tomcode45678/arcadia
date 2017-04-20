/**
 * Ajax methods
 */
export default class Ajax {

  /**
   * Check if string is JSON
   * @param string
   * @returns {boolean}
   */
  static isJSON (string) {
    let returnValue = false;
    if (typeof string === 'string') {
      try {
        JSON.parse(string);
        returnValue = true;
      }
      catch (e) {
        returnValue = false;
      }
    }
    return returnValue;
  }

  static setRequestHeader (requestHeaders, requestHeadersLength, call) {
    for (let i = 0; i < requestHeadersLength; i++) {
      const requestHeader = requestHeaders[i];
      call.setRequestHeader(requestHeader.header, requestHeader.value);
    }
  }

  /**
   * Ajax error handler
   * @param e
   * @param config
   * @returns {object}
   */
  static throwError (e, config) {
    if (typeof config.error === 'function') {
      config.error(e);
    }
    throw new Error('AJAX warning: ', 'onerror thrown', e.message, e.stack);
  }

  /**
   * What should be sent with the request to the URL
   * @param config
   * @returns {string}
   */
  static sendData (config) {
    if (config.type.toLowerCase() !== 'get') {
      if (typeof config.send === 'string') {
        return config.send;
      }
      return JSON.stringify(config.send);
    }
    return null;
  }

  /**
   * Check config parameter, apply default when required
   * @param {object} config
   * @returns {object}
   */
  static checkConfig (config) {
    if (!config.url) {
      throw new Error(
        'Invalid value of param',
        `Expected url to be String, got ${typeof config.url}`,
        'ajax call'
      );
    }

    return {
      // API/End point
      url: config.url || '',

      // Type of request GET, PUT, POST
      type: config.type || 'GET',

      // Data to send to the API
      send: config.send || null,

      // Return data format as 'JSON'
      dataType: config.dataType || null,

      // Error callback
      error: config.error || undefined,

      // Success callback
      success: config.success || undefined,

      // Cross-origin resource sharing, callback function must contain JSONP function
      crossDomain: config.crossDomain || false,

      // Request headers
      requestHeaders: config.requestHeaders || []
    };
  }

  /**
   * Parse data from request
   * @param config
   * @returns {JSON | string}
   */
  static parseResponse (config) {
    if (config.dataType && config.dataType.toLowerCase() === 'json') {
      if (Ajax.isJSON(config.responseText)) {
        config.responseText = JSON.parse(config.responseText);
      }
    }
    if (typeof config.success === 'function') {
      return config.success(config.responseText);
    }
    return config.responseText;
  }

  constructor (config) {
    if (config) {
      this.call(config);
    }
  }

  /**
   * Call AJAX functionality
   * @param {object} config
   * @returns {string | JSON | undefined}
   */
  call (config) {
    config = Ajax.checkConfig(config);

    const call = new XMLHttpRequest();

    call.open(config.type, config.url, true);

    call.onload = () => {
      this.responseHandler(call, config);
    };

    if (call.onerror) {
      call.onerror = (e) => {
        Ajax.throwError(e, config);
      };
    }

    if (call.withCredentials && config.crossDomain) {
      call.withCredentials = true;
    }

    const requestHeaders = config.requestHeaders;
    if (requestHeaders && requestHeaders.length) {
      Ajax.setRequestHeader(requestHeaders, requestHeaders.length, call);
    }

    call.send(Ajax.sendData(config));
  }

  /**
   * Get request
   * @param {object} config
   */
  get (config = {}) {
    config.type = 'GET';
    this.call(config);
  }

  /**
   * Put request
   * @param {object} config
   * @returns {object}
   */
  put (config = {}) {
    config.type = 'PUT';
    this.call(config);
  }

  /**
   * Post request
   * @param {object} config
   */
  post (config = {}) {
    config.type = 'POST';
    this.call(config);
  }

  /**
   * Ajax response handler
   * @param call
   * @param config
   * @returns {object | string}
   */
  responseHandler (call, config) {
    if (call.readyState === 4) {
      const status = call.status;

      if (status === 200) {
        config.responseText = call.response || call.responseText;
        return Ajax.parseResponse(config);
      }

      if (status === 400) {
        return this.responseError(
          config.error,
          [
            'AJAX error: ',
            'status 400',
            `AJAX call was not available for ${config.url}`
          ]
        );
      }

      if (status === 404) {
        return this.responseError(
          config.error,
          [
            'AJAX error: ',
            'status 404',
            `AJAX call was not found for ${config.url}`
          ]
        );
      }
      return this.responseError(
        config.error,
        [
          'AJAX error: ',
          `status ${status}`,
          `AJAX call failed for ${config.url}`
        ]
      );
    }
    return '';
  }

  /**
   * Error handler
   * @param customError
   * @param error
   * @param status
   * @param message
   */
  responseError (customError, { error, status, message }) {
    if (customError) {
      return customError.apply(this, [error, status, message]);
    }
    throw new Error(error, status, message);
  }
}

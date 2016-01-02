/**
 * Ajax methods
 */
export default class Ajax {
  constructor (...args) {
    if (args.length) {
      this.call(args[0]);
    }
  }

  /**
   * Call AJAX functionality
   * @param {object} config
   * @returns {string | JSON | undefined}
   */
  call(config) {
    config = config || {};

    config = this.checkConfig(config);

    if (!config.url) {
      throw new Error('Invalid value of param', `Expected url to be String, got ${typeof config.url}`, 'ajax call');
    }

    var call = this.getRequestObject(config.crossDomain);

    var getLoadAPIName = this.getLoadAPIName(call);

    call.open(config.type, config.url, true);

    call[getLoadAPIName] = () => {
      this.responseHandler(call, config);
    }

    if (call.onerror) {
      call.onerror = function (e) {
        this.throwError(e, config);
      };
    }

    if (call.withCredentials && config.crossDomain) {
      call.withCredentials = true;
    }

    if (config.requestHeader && call.setRequestHeader) {
      call.setRequestHeader(config.requestHeader.header, config.requestHeader.value);
    }

    call.send(this.sendData(config));
  }

  /**
   * Check config parameter, apply default when required
   * @param {object} config
   * @returns {object}
   */
  checkConfig(config) {
    config = config || {};

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
      requestHeader: config.requestHeader || false
    };
  }

  /**
   * Get request
   * @param {object} config
   */
  get(config) {
    config = config || {};

    config.type = 'GET';
    this.call(config);
  }

  /**
   * Put request
   * @param {object} config
   * @returns {object}
   */
  put(config) {
    config = config || {};

    config.type = 'PUT';
    this.call(config);
  }

  /**
   * Post request
   * @param {object} config
   */
  post(config) {
    config = config || {};

    config.type = 'POST';
    this.call(config);
  }

  /**
   * Get request object
   * @param {boolean} crossDomain
   * @returns {object}
   */
  getRequestObject(crossDomain) {
    try {
      // IE8
      return crossDomain ? new XDomainRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    } catch (error) {
      return new XMLHttpRequest();
    }
  }

  /**
   * Get load type
   * @param call
   * @returns {string}
   */
  getLoadAPIName(call) {
    return call.onload === null ? 'onload' : 'onreadystatechange';
  }

  /**
   * Ajax response handler
   * @param call
   * @param config
   * @returns {object | string}
   */
  responseHandler(call, config) {
    if (call.readyState === 4) {
      var status = call.status;

      if (status === 200) {
        config.responseText = call.response || call.responseText;
        return this.parseResponse(config);
      }

      if (status === 400) {
        return this.responseError(config.error, ['AJAX error: ', 'status 400', `AJAX call was not available for ${config.url}`]);
      }

      if (status === 404) {
        return this.responseError(config.error, ['AJAX error: ', 'status 404', `AJAX call was not found for ${config.url}`]);
      }
      return this.responseError(config.error, ['AJAX error: ', 'status ' + status, `AJAX call failed for ${config.url}`]);
    }
  }

  /**
   * Error handler
   * @param customError
   */
  responseError(customError, {error, status, message}) {
    if (customError) {
      return customError.apply(this, [error, status, message]);
    }
    throw new Error(error, status, message);
    return false;
  }

  /**
   * Ajax error handler
   * @param e
   * @param config
   * @returns {object}
   */
  throwError(e, config) {
    if (typeof config.error === 'function') {
      config.error(e);
    }
    throw new Error('AJAX warning: ', 'onerror thrown', e.message, e.stack);
    return false;
  }

  /**
   * What should be sent with the request to the URL
   * @param config
   * @returns {string}
   */
  sendData(config) {
    if (config.type.toLowerCase() !== 'get') {
      if (typeof config.send === 'string') {
        return config.send;
      } else {
        return JSON.stringify(config.send);
      }
    }
    return null;
  }

  /**
   * Parse data from request
   * @param config
   * @returns {JSON | string}
   */
  parseResponse(config) {
    if (config.dataType && config.dataType.toLowerCase() === 'json') {
      if (isJSON(config.responseText)) {
        config.responseText = JSON.parse(config.responseText);
      }
    }
    if (typeof config.success === 'function') {
      return config.success(config.responseText);
    }
    return config.responseText;
  }

  /**
   * Check if string is JSON
   * @param string
   * @returns {boolean}
   */
  isJSON(string) {
    let returnValue = false;
    if (typeof string === 'string') {
      try {
        JSON.parse(string);
        returnValue = true;
      } catch (e) {
        returnValue = false;
      }
    }
    return returnValue;
  }
}

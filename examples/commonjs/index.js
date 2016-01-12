(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajax = require('./micro-libs/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import Animation from 'lib/micro-libs/animation';
//import Fingerprinting from 'lib/micro-libs/fingerprinting';
//import Mediator from 'lib/micro-libs/mediator';
//import Perf from 'lib/micro-libs/performance';
//import Utils from 'lib/micro-libs/utils';
//import * as dom from 'lib/micro-libs/dom';

/**
 * Arcadia class containing all static functions
 */

var Arcadia = (function () {
  function Arcadia() {
    // Controlling default actions
    // mainMicroLib(...args);

    _classCallCheck(this, Arcadia);
  }

  _createClass(Arcadia, null, [{
    key: 'ajax',
    value: function ajax(config) {
      return new _ajax2.default(config);
    }
  }, {
    key: 'animation',
    value: function animation() {
      return new Animation();
    }
  }, {
    key: 'fingerprinting',
    value: function fingerprinting() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(Fingerprinting, [null].concat(args)))();
    }
  }, {
    key: 'mediator',
    value: function mediator() {
      return new Mediator();
    }
  }, {
    key: 'publish',
    value: function publish() {
      return new mediator().publish;
    }
  }, {
    key: 'subscribe',
    value: function subscribe() {
      return new mediator().subscribe;
    }
  }, {
    key: 'perf',
    value: function perf() {
      return new Perf();
    }
  }, {
    key: 'utils',
    value: function utils() {
      return new Utils();
    }
  }, {
    key: 'dom',
    value: (function (_dom) {
      function dom() {
        return _dom.apply(this, arguments);
      }

      dom.toString = function () {
        return _dom.toString();
      };

      return dom;
    })(function () {
      return new dom();
    })
  }, {
    key: 'on',
    value: function on() {
      return new dom().on;
    }
  }, {
    key: 'select',
    value: function select() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new (Function.prototype.bind.apply(dom, [null].concat(args)))();
    }
  }]);

  return Arcadia;
})();

exports.default = Arcadia;


},{"./micro-libs/ajax":2}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Ajax methods
 */

var Ajax = (function () {
  function Ajax(config) {
    _classCallCheck(this, Ajax);

    if (config) {
      this.call(config);
    }
  }

  /**
   * Call AJAX functionality
   * @param {object} config
   * @returns {string | JSON | undefined}
   */

  _createClass(Ajax, [{
    key: 'call',
    value: function call(config) {
      var _this = this;

      config = this.checkConfig(config);

      var call = this.getRequestObject(config.crossDomain);

      var getLoadAPIName = this.getLoadAPIName(call);

      call.open(config.type, config.url, true);

      call[getLoadAPIName] = function () {
        _this.responseHandler(call, config);
      };

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
     * Get request
     * @param {object} config
     */

  }, {
    key: 'get',
    value: function get() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      config.type = 'GET';
      this.call(config);
    }

    /**
     * Put request
     * @param {object} config
     * @returns {object}
     */

  }, {
    key: 'put',
    value: function put() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      config.type = 'PUT';
      this.call(config);
    }

    /**
     * Post request
     * @param {object} config
     */

  }, {
    key: 'post',
    value: function post() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      config.type = 'POST';
      this.call(config);
    }

    /**
     * Check config parameter, apply default when required
     * @param {object} config
     * @returns {object}
     */

  }, {
    key: 'checkConfig',
    value: function checkConfig(config) {
      if (!config.url) {
        throw new Error('Invalid value of param', 'Expected url to be String, got ' + _typeof(config.url), 'ajax call');
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
        requestHeader: config.requestHeader || false
      };
    }

    /**
     * Get request object
     * @param {boolean} crossDomain
     * @returns {object}
     */

  }, {
    key: 'getRequestObject',
    value: function getRequestObject(crossDomain) {
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

  }, {
    key: 'getLoadAPIName',
    value: function getLoadAPIName(call) {
      return call.onload === null ? 'onload' : 'onreadystatechange';
    }

    /**
     * Ajax response handler
     * @param call
     * @param config
     * @returns {object | string}
     */

  }, {
    key: 'responseHandler',
    value: function responseHandler(call, config) {
      if (call.readyState === 4) {
        var status = call.status;

        if (status === 200) {
          config.responseText = call.response || call.responseText;
          return this.parseResponse(config);
        }

        if (status === 400) {
          return this.responseError(config.error, ['AJAX error: ', 'status 400', 'AJAX call was not available for ' + config.url]);
        }

        if (status === 404) {
          return this.responseError(config.error, ['AJAX error: ', 'status 404', 'AJAX call was not found for ' + config.url]);
        }
        return this.responseError(config.error, ['AJAX error: ', 'status ' + status, 'AJAX call failed for ' + config.url]);
      }
    }

    /**
     * Error handler
     * @param customError
     */

  }, {
    key: 'responseError',
    value: function responseError(customError, _ref) {
      var error = _ref.error;
      var status = _ref.status;
      var message = _ref.message;

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

  }, {
    key: 'throwError',
    value: function throwError(e, config) {
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

  }, {
    key: 'sendData',
    value: function sendData(config) {
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

  }, {
    key: 'parseResponse',
    value: function parseResponse(config) {
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

  }, {
    key: 'isJSON',
    value: function isJSON(string) {
      var returnValue = false;
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
  }]);

  return Ajax;
})();

exports.default = Ajax;


},{}],3:[function(require,module,exports){
'use strict';

var _arcadia = require('./lib/arcadia');

var _arcadia2 = _interopRequireDefault(_arcadia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajaxSettings = {
  url: 'index.html',
  type: 'get',
  success: function success(data) {
    console.log('Response Length: ' + data.length);
  }
};

_arcadia2.default.ajax(ajaxSettings);

_arcadia2.default.ajax().call(ajaxSettings);

delete ajaxSettings.type;

_arcadia2.default.ajax().get(ajaxSettings);


},{"./lib/arcadia":1}]},{},[3]);

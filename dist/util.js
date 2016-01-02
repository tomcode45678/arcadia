'use strict';

define('main', ['lib/arcadia'], function (_arcadia) {
  var _arcadia2 = _interopRequireDefault(_arcadia);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var arcadia = new _arcadia2.default();
  arcadia.ajax().get({
    url: 'index.html',
    success: function success(data) {
      console.log('Response Length: ' + data.length);
    }
  });
});
'use strict';

define('lib/arcadia', ['exports', 'lib/micro-libs/ajax'], function (exports, _ajax) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ajax2 = _interopRequireDefault(_ajax);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var Arcadia = (function () {
    function Arcadia() {
      _classCallCheck(this, Arcadia);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length) {}
    }

    _createClass(Arcadia, [{
      key: 'ajax',
      value: function ajax() {
        return new _ajax2.default();
      }
    }]);

    return Arcadia;
  })();

  exports.default = Arcadia;
});
'use strict';

define('lib/micro-libs/ajax', ['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var Ajax = (function () {
    function Ajax() {
      _classCallCheck(this, Ajax);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length) {
        this.call(args[0]);
      }
    }

    _createClass(Ajax, [{
      key: 'call',
      value: function call(config) {
        var _this = this;

        config = config || {};
        config = this.checkConfig(config);

        if (!config.url) {
          throw new Error('Invalid value of param', 'Expected url to be String, got ' + _typeof(config.url), 'ajax call');
        }

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
    }, {
      key: 'checkConfig',
      value: function checkConfig(config) {
        config = config || {};
        return {
          url: config.url || '',
          type: config.type || 'GET',
          send: config.send || null,
          dataType: config.dataType || null,
          error: config.error || undefined,
          success: config.success || undefined,
          crossDomain: config.crossDomain || false,
          requestHeader: config.requestHeader || false
        };
      }
    }, {
      key: 'get',
      value: function get(config) {
        config = config || {};
        config.type = 'GET';
        this.call(config);
      }
    }, {
      key: 'put',
      value: function put(config) {
        config = config || {};
        config.type = 'PUT';
        this.call(config);
      }
    }, {
      key: 'post',
      value: function post(config) {
        config = config || {};
        config.type = 'POST';
        this.call(config);
      }
    }, {
      key: 'getRequestObject',
      value: function getRequestObject(crossDomain) {
        try {
          return crossDomain ? new XDomainRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        } catch (error) {
          return new XMLHttpRequest();
        }
      }
    }, {
      key: 'getLoadAPIName',
      value: function getLoadAPIName(call) {
        return call.onload === null ? 'onload' : 'onreadystatechange';
      }
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
    }, {
      key: 'throwError',
      value: function throwError(e, config) {
        if (typeof config.error === 'function') {
          config.error(e);
        }

        throw new Error('AJAX warning: ', 'onerror thrown', e.message, e.stack);
        return false;
      }
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
});
//# sourceMappingURL=util.js.map

/**
 * DOM manipulation class
 *
 * Used for dom traversing, event binding, filtering, scrolling, class checking, attribute modification and many more.
 */
export default class DOMTraverse {

  constructor(selector, contains, attribute) {
    this.elements = [];

    if (!selector) {
      return this;
    }

    this.parse(selector);

    if (contains) {
      this.containsString(contains, attribute);
    }
  }

  add(selector) {
    this.parse(selector);
    return this;
  }

  parse(selector) {
    if (Array.isArray(selector)) {
      for (let i = 0; i < selector.length; i++) {
        this.parse(selector[i]);
      }
    }

    if (typeof selector === 'string') {
      let results = document.querySelectorAll(selector);
      if (results.length) {
        return this.elements.push(results);
      }
    }

    if (this.isDomElement(selector)) {
      return this.elements = [selector];
    }

    if (this.isNodeList(selector)) {
      return this.elements.push(selector);
    }
  }

  /**
   * Check for NodeList
   * @param object
   * @returns {boolean}
   */
  isNodeList(object) {
    return (typeof object === 'object' && object.length &&
      (object.length === 0 || (typeof object[0] === 'object' && object[0].nodeType === 1))) ||
      (!String(object) ? object.toString() : String(object)).indexOf('NodeList') !== -1;
  }

  /**
   * Check for DOM Element
   * @param element
   * @returns {boolean}
   */
  isDomElement(element) {
    return window.HTMLElement !== undefined ? element instanceof HTMLElement : element.nodeType === 1;
  }

  /**
   * Add event to HTML element(s)
   * @param event
   * @param callback
   * @param [element]
   * @param {boolean} [useCapture]
   * @returns {object}
   */
  on(...args) {
    return this.event('on', ...args);
  }

  /**
   * Add event to HTML element(s)
   * @param event
   * @param callback
   * @param [element]
   * @returns {object}
   */
  off(...args) {
    return this.event('off', ...args);
  }

  event(eventType = 'on', ...args) {
    if (arguments.length !== 3 && arguments.length !== 4) {
      console.error('Invalid amount of arguments', `Expected 2 or 3, got ${arguments.length}`, eventType);
    }

    let [event, callback, element, useCapture] = args;
    let apiType = 'addEventListener';

    element = element || this.elements;

    if (!useCapture) {
      useCapture = false;
    }

    if (eventType === 'off') {
      apiType = 'removeEventListener';
    }

    if (this.isDomElement(element)) {
      element[apiType](event, callback, useCapture);
      return this;
    }

    if (Array.isArray(element) || this.isNodeList(element)) {
      for (let i = 0, elementLength = element.length; i < elementLength; i++) {
        this.event(eventType, event, callback, element[i]);
      }
    }
  }

  /**
   * Find attribute
   * @param {string} [attribute]
   * @param {object} [element]
   * @returns {string}
   */
  findAttribute(attribute, element) {
    attribute = String(attribute);
    element = element || this.elements[0];

    let defaultValue = '';

    if (this.isNodeList(element) || !this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'getAttribute');
      return defaultValue;
    }

    if (element.getAttribute(attribute)) {
      return element.getAttribute(attribute);
    } else {
      while (element !== document) {
        if (element.getAttribute(attribute)) {
          return element.getAttribute(attribute);
        }
        element = element.parentNode;
      }
      return defaultValue;
    }
  }

  /**
   * Set attribute
   * @param {string} [attribute]
   * @param {string} [value]
   * @param {object} [element]
   * @returns {string}
   */
  setAttribute(attribute, value, element) {
    attribute = String(attribute);
    value = String(value);
    element = element || this.elements[0];

    let defaultValue = '';

    if (this.isNodeList(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'setAttribute');
      return defaultValue;
    }

    if (!this.isDomElement(element)) {
      return defaultValue;
    }
    element.setAttribute(attribute, value);

    return attribute;
  }

  /**
   * Remove attribute
   * @param {string} attribute
   * @param {object} [element]
   * @returns {boolean}
   */
  removeAttribute(attribute, element) {
    attribute = String(attribute);
    element = element || this.elements[0];

    let defaultValue = false;

    if (this.isNodeList(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'setAttribute');
      return defaultValue;
    }

    if (!this.isDomElement(element)) {
      return defaultValue;
    }

    if (element.hasAttribute(attribute)) {
      element.removeAttribute(attribute);
      return true;
    }
    return defaultValue;
  }

  /**
   * Find element only looping up the DOM to then look back down
   * @param {string} find
   * @param {object} [element]
   * @returns {elementsModule}
   */
  closest(find, element) {
    find = String(find);
    element = element || this.elements[0];

    if (!this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'closest');
      this.elements = [document];
      return this;
    }

    this.elements = [(() => {
      if (element.querySelectorAll(find).length) {
        return element.querySelector(find);
      }

      if (element.parentNode.querySelector(find)) {
        return element.parentNode.querySelector(find);
      }
      while (element !== document) {
        if (element.querySelector(find)) {
          return element.querySelector(find);
        }
        element = element.parentNode;
      }
      return document;
    })()];

    return this;
  }

  /**
   * Closest Improved (closest on steroids)
   * @param {string} find
   * @param {object} [element]
   * @returns {object}
   */
  closestI(find, element) {
    find = String(find);
    element = element || this.elements[0];

    if (!this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'closestI');
      this.elements = [document];
      return this;
    }

    let findElement = function (element, elementFound, parentFound, sameLevel) {
      // Loop through number of possible candidates
      for (let i = 0; i < elementFound.length; i++) {
        if (sameLevel && elementFound[i].parentNode.contains(element)) {
          return elementFound[i];
        }

        if (elementFound[i].contains(element)) {
          return elementFound[i];
        }
      }

      // Element is deeply nested within either previous or next element sibling
      for (let i = 0; i < elementFound.length; i++) {
        let elementFoundCopy = elementFound[i];

        while (!elementFoundCopy.contains(element) && elementFoundCopy !== document) {
          if (elementFoundCopy.previousElementSibling) {
            if (elementFoundCopy.previousElementSibling.contains(element)) {
              return elementFound[i];
            }
          }

          if (elementFoundCopy.nextElementSibling) {
            if (elementFoundCopy.nextElementSibling.contains(element)) {
              return elementFound[ii];
            }
          }
          elementFoundCopy = elementFoundCopy.parentNode;
        }
      }
      return element;
    };

    this.elements = [(() => {
      if (element.querySelectorAll(find).length) {
        return element.querySelector(find);
      }

      if (element.parentNode.querySelectorAll(find).length) {
        return findElement(element, element.parentNode.querySelectorAll(find), element.parentNode, true);
      }

      while (element !== document) {
        let elementFind = element.querySelectorAll(find);
        if (elementFind.length) {
          return findElement(elementsModule.element, elementFind, element);
        }
        element = element.parentNode;
      }
      return document;
    })()];

    return this;
  }

  /**
   * Check for a class name
   * @param className
   * @param [element]
   * @returns {boolean}
   */
  hasClass(className, element) {
    className = String(className);
    element = element || this.elements[0];

    if (!this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'hasClass');
      return false;
    }

    if (element.className.indexOf(className) === -1) {
      return false;
    }

    if (element.classList) {
      return element.classList.contains(className);
    }

    let classes = element.className.split(' ');
    for (let i = 0, classesLength = classes.length; i < classesLength; i++) {
      if (classes[i] === className) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add a class name
   * @param className
   * @param element
   */
  addClass(className, element) {
    element = element || this.elements[0];

    if (!this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'addClass');
      return false;
    }

    if (typeof className === 'string') {
      className = [className];
    }

    for (let i = 0, classNameLength = className.length; i < classNameLength; i++) {
      let classString = className[i];
      if (element.classList) {
        element.classList.add(classString);
      } else {
        this.modifyClass('add', classString, element);
      }
    }
  }

  /**
   * Remove a class name
   * @param className
   * @param element
   */
  removeClass(className, element) {
    element = element || this.elements[0];

    if (!isDomElement(element)) {
      elementsModule.debug.warn('This function expects to use one DOM element', 'Got' + typeof element, 'removeClass');
      return false;
    }

    if (typeof className === 'string') {
      className = [className];
    }

    for (let i = 0, classNameLength = className.length; i < classNameLength; i++) {
      let classString = className[i];
      if (element.classList) {
        element.classList.remove(classString);
      } else {
        this.modifyClass('remove', classString, element);
      }
    }
  }

  /**
   * Modify classes
   * @param action
   * @param className
   * @param element
   * @returns {boolean}
   */
  modifyClass(action, className, element) {
    let classes = this.getAttribute('class', element).split(' ');

    for (let i = 0, classesLength = classes.length; i < classesLength; i++) {
      if (classes[i] === className) {
        if (action === 'remove') {
          classes.splice(i, 1);
          break;
        } else {
          return true;
        }
      }
    }

    if (action === 'add') {
      classes.push(className);
    }

    this.setAttribute('class', classes.join(' '), element);

    return element.className.indexOf(className) > -1;
  }

  /**
   * Get text of element
   * @param {boolean} [neat]
   * @param [element]
   * @returns {string}
   */
  getText(neat, element) {
    element = element || this.elements[0];

    let defaultValue = '';

    if (!this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'getText');
      return defaultValue;
    }

    let elementText = element.textContent;
    if (neat) {
      elementText = elementText.trim();
    }
    return elementText || defaultValue;
  }

  /**
   * For each element
   * @param callback {function}
   * @param [element]
   * @param [count]
   * @returns {object | undefined}
   */
  forEach(callback, element, count = 0) {
    if (typeof callback !== 'function') {
      console.error('Invalid value of callback', `Expected function to be Function, got ${typeof callback}`, 'forEach');
      return;
    }

    element = element || this.elements;

    if (this.isDomElement(element)) {
      this.elements = [element];
      callback(element, count + 1);
      return;
    }

    if (Array.isArray(element) || this.isNodeList(element)) {
      for (let i = 0; i < element.length; i++) {
        this.forEach(callback, element[i], i);
      }
    }
  }

  /**
   * Detect if the element is fully within the window
   * @param {object} [element]
   * @returns {boolean}
   */
  onScreen(element) {
    element = element || this.elements[0];

    if (!this.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'onScreen');
    }

    let documentScrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop,
      objectTop = element.offsetTop,
      objectHeight = element.clientHeight,
      windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return ((objectTop <= documentScrollTop + windowHeight) && (objectTop >= documentScrollTop) && (documentScrollTop + windowHeight) - (objectHeight + objectTop) >= 0);
  }

  /**
   * Scroll to an element within at a specific speed
   * @param {object} element
   * @param {number} speed
   */
  scrollTo(element, speed) {
    let scrollApi = window.scrollTo || window.scrollBy || (window.scroll = window.scroll || null);
    if (!element || !scrollApi) {
      return;
    }
    let elementTop = element.offsetTop;

    if (!speed) {
      scrollApi(0, elementTop);
    }
    speed = Number(speed);

    let offset = window.pageYOffset, difference = elementTop - window.pageYOffset;
    let start = Date.now();
    let timerIndex = 0;

    let scrollTimer;
    if (scrollTimer) {
      clearInterval(scrollTimer);
    }

    function scroll() {
      timerIndex = (Date.now() - start) / speed;
      if (timerIndex >= 1) {
        clearInterval(scrollTimer);
        timerIndex = 1;
      }
      let calculation = timerIndex * difference + offset;
      window.scrollBy(0, calculation - window.pageYOffset);
    }

    scrollTimer = setInterval(scroll, 10);
  }

  /**
   * Element contains string (TODO check if needed)
   * @param {string} string (case sensitive)
   * @param {string | boolean} [attribute]
   * @param {Element | NodeList | Array} [element]
   * @returns {elementsModule}
   */
  containsString(string, attribute, element) {
    element = element || this.elements;

    if (typeof string !== 'string') {
      console.error('Invalid value of param', `Expected string to be String, got ${typeof string}`, 'containsString');
    }

    if (!element || element.length === 0) {
      console.error('Invalid value of param', `Expected object to be Element | NodeList | Array, got ${typeof element}`, 'containsString');
    }

    let filterElements = (string, attribute, element) => {

      if (this.isDomElement(element)) {
        let textValue = this.getText(true, element);
        if (attribute === undefined && textValue) {
          if (textValue.indexOf(string) > -1) {
            this.elements.push(element);
          }
        } else if (element.getAttribute(attribute)) {
          if (element.getAttribute(attribute).indexOf(string) > -1) {
            this.elements.push(element);
          }
        }
      }

      if (Array.isArray(element) || this.isNodeList(element)) {
        for (let i = 0; i < element.length; i++) {
          filterElements.call(this, string, attribute, element[i]);
        }
      }
    };

    this.elements = [];

    filterElements.call(this, string, attribute, element);

    return this;
  }
}

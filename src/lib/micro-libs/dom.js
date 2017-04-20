/* eslint-disable consistent-return, no-console */

/**
 * DOM manipulation class
 *
 * Used for dom traversing,
 * event binding, filtering, scrolling, class checking,
 * attribute modification and many more.
 */
export default class DOMHelper {

  /**
   * Modify classes
   * @param action
   * @param className
   * @param element
   * @returns {boolean}
   */
  static modifyClass (action, className, element) {
    const classes = element.getAttribute('class').split(' ');

    for (let i = 0, classesLength = classes.length; i < classesLength; i++) {
      if (classes[i] === className) {
        if (action === 'remove') {
          classes.splice(i, 1);
          break;
        }
        else {
          return true;
        }
      }
    }

    if (action === 'add') {
      classes.push(className);
    }
    element.setAttribute('class', classes.join(' '));

    return element.className.indexOf(className) > -1;
  }

  /**
   * Check for NodeList
   * @param object
   * @returns {boolean}
   */
  static isNodeList (object) {
    return (typeof object === 'object' && object.length &&
      (object.length === 0 || (typeof object[0] === 'object' && object[0].nodeType === 1))) ||
      (!String(object) ? object.toString() : String(object)).indexOf('NodeList') !== -1;
  }

  /**
   * Check for DOM Element
   * @param element
   * @returns {boolean}
   */
  static isDomElement (element) {
    return element.ELEMENT_NODE === 1 || element.nodeType === 1;
  }

  /**
   * Scroll to an element within at a specific speed
   * @param {object} element
   * @param {number} speed
   */
  static scrollTo (element, speed) {
    const scrollApi = window.scrollTo || window.scrollBy || (window.scroll = window.scroll || null);
    if (!element || !scrollApi) {
      return;
    }
    const elementTop = element.offsetTop;

    if (!speed) {
      scrollApi(0, elementTop);
    }
    speed = Number(speed);

    const offset = window.pageYOffset;
    const difference = elementTop - window.pageYOffset;
    const start = Date.now();

    let scrollTimer = 0;
    if (scrollTimer) {
      clearInterval(scrollTimer);
    }

    const scroll = () => {
      let timerIndex = (Date.now() - start) / speed;
      if (timerIndex >= 1) {
        clearInterval(scrollTimer);
        timerIndex = 1;
      }
      const distance = timerIndex * difference;
      const distanceToGo = distance + offset;
      window.scrollBy(0, distanceToGo - window.pageYOffset);
    };

    scrollTimer = setInterval(scroll, 10);
  }

  constructor (selector, contains, attribute) {
    this.elements = [];

    if (!selector) {
      return this;
    }

    this.parse(selector);

    if (contains) {
      this.containsString(contains, attribute);
    }
  }

  add (selector) {
    this.parse(selector);
    return this;
  }

  parse (selector) {
    if (Array.isArray(selector)) {
      for (let i = 0; i < selector.length; i++) {
        this.parse(selector[i]);
      }
    }

    if (typeof selector === 'string') {
      const results = document.querySelectorAll(selector);
      if (results.length) {
        return this.elements.push(results);
      }
    }

    if (DOMHelper.isDomElement(selector)) {
      this.elements = [selector];
      return this.elements;
    }

    if (DOMHelper.isNodeList(selector)) {
      return this.elements.push(selector);
    }
  }

  /**
   * Add event to HTML element(s)
   * @param args
   * @returns {object}
   */
  on (...args) {
    return this.event('on', ...args);
  }

  /**
   * Add event to HTML element(s)
   * @param args
   * @returns {object}
   */
  off (...args) {
    return this.event('off', ...args);
  }

  event (eventType, ...args) {
    if (args.length !== 2 && args.length !== 3) {
      console.error(
        'Invalid amount of arguments', `
        Expected 2 or 3, got ${args.length + 1}`,
        eventType
      );
    }

    const [event, callback, element, capture] = args;
    let apiType = 'addEventListener';

    const preferedElement = element || this.elements;
    let useCapture = false;
    if (capture) {
      useCapture = true;
    }

    if (eventType === 'off') {
      apiType = 'removeEventListener';
    }

    if (DOMHelper.isDomElement(preferedElement)) {
      preferedElement[apiType](event, callback, useCapture);
      return this;
    }

    if (Array.isArray(preferedElement) || DOMHelper.isNodeList(preferedElement)) {
      for (let i = 0, elementLength = preferedElement.length; i < elementLength; i++) {
        this.event(eventType, event, callback, preferedElement[i]);
      }
    }
  }

  /**
   * Find attribute
   * @param {string} [attribute]
   * @param {object} [element]
   * @returns {string}
   */
  findAttribute (attribute, element) {
    attribute = String(attribute);
    element = element || this.elements[0];

    const defaultValue = '';

    if (DOMHelper.isNodeList(element) || !DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'getAttribute'
      );
      return defaultValue;
    }

    if (element.getAttribute(attribute)) {
      return element.getAttribute(attribute);
    }
    while (element !== document) {
      if (element.getAttribute(attribute)) {
        return element.getAttribute(attribute);
      }
      element = element.parentNode;
    }
    return defaultValue;
  }

  /**
   * Set attribute
   * @param {string} [attribute]
   * @param {string} [value]
   * @param {object} [element]
   * @returns {string}
   */
  setAttribute (attribute, value, element) {
    attribute = String(attribute);
    value = String(value);
    element = element || this.elements[0];

    const defaultValue = '';

    if (DOMHelper.isNodeList(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'setAttribute'
      );
      return defaultValue;
    }

    if (!DOMHelper.isDomElement(element)) {
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
  removeAttribute (attribute, element) {
    attribute = String(attribute);
    element = element || this.elements[0];

    const defaultValue = false;

    if (DOMHelper.isNodeList(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'setAttribute'
      );
      return defaultValue;
    }

    if (!DOMHelper.isDomElement(element)) {
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
   * @returns {object}
   */
  closest (find, element) {
    find = String(find);
    element = element || this.elements[0];

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'closest'
      );
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
  closestI (find, element) {
    find = String(find);
    element = element || this.elements[0];

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'closestI'
      );
      this.elements = [document];
      return this;
    }

    const findElement = function getNestedElement (
      baseElement,
      elementFound,
      parentFound,
      sameLevel
    ) {
      // Loop through number of possible candidates
      for (let i = 0; i < elementFound.length; i++) {
        if (sameLevel && elementFound[i].parentNode.contains(baseElement)) {
          return elementFound[i];
        }

        if (elementFound[i].contains(baseElement)) {
          return elementFound[i];
        }
      }

      // Element is deeply nested within either previous or next element sibling
      for (let i = 0; i < elementFound.length; i++) {
        let elementFoundCopy = elementFound[i];

        while (!elementFoundCopy.contains(baseElement) && elementFoundCopy !== document) {
          if (elementFoundCopy.previousElementSibling) {
            if (elementFoundCopy.previousElementSibling.contains(baseElement)) {
              return elementFound[i];
            }
          }

          if (elementFoundCopy.nextElementSibling) {
            if (elementFoundCopy.nextElementSibling.contains(baseElement)) {
              return elementFound[i];
            }
          }
          elementFoundCopy = elementFoundCopy.parentNode;
        }
      }
      return baseElement;
    };

    this.elements = [(() => {
      if (element.querySelectorAll(find).length) {
        return element.querySelector(find);
      }

      if (element.parentNode.querySelectorAll(find).length) {
        return findElement(
          element,
          element.parentNode.querySelectorAll(find),
          element.parentNode,
          true
        );
      }

      while (element !== document) {
        const elementFind = element.querySelectorAll(find);
        if (elementFind.length) {
          return findElement(element, elementFind, element);
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
  hasClass (className, element) {
    className = String(className);
    element = element || this.elements[0];

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'hasClass'
      );
      return false;
    }

    if (element.className.indexOf(className) === -1) {
      return false;
    }

    if (element.classList) {
      return element.classList.contains(className);
    }

    const classes = element.className.split(' ');
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
  addClass (className, element) {
    element = element || this.elements[0];

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'addClass'
      );
      return false;
    }

    if (typeof className === 'string') {
      className = [className];
    }

    for (let i = 0, classNameLength = className.length; i < classNameLength; i++) {
      const classString = className[i];
      if (element.classList) {
        element.classList.add(classString);
      }
      else {
        DOMHelper.modifyClass('add', classString, element);
      }
    }
  }

  /**
   * Remove a class name
   * @param className
   * @param element
   */
  removeClass (className, element) {
    element = element || this.elements[0];

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'removeClass'
      );
      return false;
    }

    if (typeof className === 'string') {
      className = [className];
    }

    for (let i = 0, classNameLength = className.length; i < classNameLength; i++) {
      const classString = className[i];
      if (element.classList) {
        element.classList.remove(classString);
      }
      else {
        DOMHelper.modifyClass('remove', classString, element);
      }
    }
  }

  /**
   * Get text of element
   * @param {boolean} [neat]
   * @param [element]
   * @returns {string}
   */
  getText (neat, element) {
    element = element || this.elements[0];

    const defaultValue = '';

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'getText'
      );
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
  forEach (callback, element, count = 0) {
    if (typeof callback !== 'function') {
      console.error(
        'Invalid value of callback',
        `Expected function to be Function, got ${typeof callback}`,
        'forEach'
      );
      return;
    }

    element = element || this.elements;

    if (DOMHelper.isDomElement(element)) {
      this.elements = [element];
      callback(element, count + 1);
      return;
    }

    if (Array.isArray(element) || DOMHelper.isNodeList(element)) {
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
  onScreen (element) {
    element = element || this.elements[0];

    if (!DOMHelper.isDomElement(element)) {
      console.warn(
        'This function expects to use one DOM element',
        `Got ${typeof element}`,
        'onScreen'
      );
    }

    const documentScrollTop = (
      document.documentElement ||
      document.body.parentNode ||
      document.body
    ).scrollTop;
    const objectTop = element.offsetTop;
    const objectHeight = element.clientHeight;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return (
    (objectTop <= documentScrollTop + windowHeight) &&
    (objectTop >= documentScrollTop) &&
    (documentScrollTop + windowHeight) -
    (objectHeight + objectTop)
    >= 0);
  }

  /**
   * Element contains string (TODO check if needed)
   * @param {string} string (case sensitive)
   * @param {string | boolean} [attribute]
   * @param {Element | NodeList | Array} [element]
   * @returns {object}
   */
  containsString (string, attribute, element) {
    element = element || this.elements;

    if (typeof string !== 'string') {
      console.error(
        'Invalid value of param',
        `Expected string to be String, got ${typeof string}`,
        'containsString'
      );
    }

    if (!element || element.length === 0) {
      console.error(
        'Invalid value of param',
        `Expected object to be Element | NodeList | Array, got ${typeof element}`,
        'containsString'
      );
    }

    const filterElements = (find, useAttribute, node) => {
      if (DOMHelper.isDomElement(node)) {
        const textValue = this.getText(true, node);
        if (useAttribute === undefined && textValue) {
          if (textValue.indexOf(find) > -1) {
            this.elements.push(node);
          }
        }
        else if (node.getAttribute(attribute)) {
          if (node.getAttribute(attribute).indexOf(find) > -1) {
            this.elements.push(node);
          }
        }
      }

      if (Array.isArray(node) || DOMHelper.isNodeList(node)) {
        for (let i = 0; i < node.length; i++) {
          filterElements(find, attribute, node[i]);
        }
      }
    };

    this.elements = [];

    filterElements(string, attribute, element);

    return this;
  }
}

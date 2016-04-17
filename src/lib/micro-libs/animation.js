/* globals console, setInterval, clearInterval */

import DOMTraverse from './dom-traverse';

/**
 * Animation class
 */
export default class Animation extends DOMTraverse {
  constructor () {
    super();
  }

  /**
   * Fades DOM element in
   * @param {object} element
   * @param {function} [callback]
   */
  fadeIn(element, callback) {
    if(!element || !super.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'fadeIn');
      return;
    }

    var opacity = 0;
    var interval = setInterval(() => {
      opacity = opacity + 0.02;
      element.style.opacity = opacity;
      if (element.style.opacity >= 0.9) {
        element.style.opacity = 1;
        clearInterval(interval);
        if (callback) {
          callback(element);
        }
      }
    }, 10);
  }

  /**
   * Fades DOM element out
   * @param {object} element
   * @param {function} [callback]
   */
  fadeOut(element, callback) {
    if(!element || !super.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'fadeOut');
      return;
    }

    element.style.opacity = 1;
    var interval = setInterval(() => {
      element.style.opacity = element.style.opacity - 0.02;
      if (element.style.opacity <= 0.1) {
        element.style.opacity = 0;
        clearInterval(interval);
        if (callback) {
          callback(element);
        }
      }
    }, 10);
  }
}

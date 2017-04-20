/* eslint-disable no-console */

import DOMHelper from './dom';

/**
 * Animation class
 */
export default class Animation {
  /**
   * Fades DOM element in
   * @param {object} element
   * @param {function} [callback]
   */
  static fadeIn (element, callback) {
    if (!element || !DOMHelper.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'fadeIn');
      return;
    }

    let opacity = 0;
    const interval = setInterval(() => {
      opacity += 0.02;
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
  static fadeOut (element, callback) {
    if (!element || !DOMHelper.isDomElement(element)) {
      console.warn('This function expects to use one DOM element', `Got ${typeof element}`, 'fadeOut');
      return;
    }

    element.style.opacity = 1;
    const interval = setInterval(() => {
      element.style.opacity -= 0.02;
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

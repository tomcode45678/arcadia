import Ajax from 'lib/micro-libs/ajax';

/**
 * Arcadia class containing all Facade micro libraries
 */
export default class Arcadia {
  constructor (...args) {
    if (args.length) {
      // Main micro lib
    }
  }

  ajax() {
    return new Ajax();
  }
}

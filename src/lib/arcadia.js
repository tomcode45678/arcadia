import Ajax from './micro-libs/ajax';
//import Animation from './micro-libs/animation';
//import Fingerprinting from './micro-libs/fingerprinting';
//import Mediator from './micro-libs/mediator';
//import Perf from './micro-libs/performance';
//import Utils from './micro-libs/utils';
import DOMTraverse from './micro-libs/dom-traverse';

/**
 * Arcadia class containing all static functions
 */
export default class Arcadia {
  constructor (...args) {
    new DOMTraverse(...args);
  }

  static ajax(config) {
    return new Ajax(config);
  }

  static animation() {
    //return new Animation();
  }

  static fingerprinting(/*...args*/) {
    //return new Fingerprinting(...args);
  }

  static mediator() {
    //return new Mediator();
  }

  static publish() {
    //return new mediator().publish;
  }

  static subscribe() {
    //return new mediator().subscribe;
  }

  static perf() {
    //return new Perf();
  }

  static utils() {
    //return new Utils();
  }

  static DOMTraverse(...args) {
    return new DOMTraverse(...args);
  }

  static on(...args) {
    return new DOMTraverse(...args).on;
  }

  static find(...args) {
    return new DOMTraverse(...args);
  }
}

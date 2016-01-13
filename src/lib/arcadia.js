import Ajax from './micro-libs/ajax';
//import Animation from 'lib/micro-libs/animation';
//import Fingerprinting from 'lib/micro-libs/fingerprinting';
//import Mediator from 'lib/micro-libs/mediator';
//import Perf from 'lib/micro-libs/performance';
//import Utils from 'lib/micro-libs/utils';
//import * as dom from 'lib/micro-libs/dom';

/**
 * Arcadia class containing all static functions
 */
export default class Arcadia {
  constructor (/*...args*/) {
    // Controlling default actions
    // mainMicroLib(...args);
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

  static dom() {
    //return new dom();
  }

  static on() {
    //return new dom().on;
  }

  static select(/*...args*/) {
    //return new dom(...args);
  }
}

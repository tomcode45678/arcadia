/* eslint-disable import/no-unresolved */

import Ajax from './micro-libs/ajax';
import Animation from './micro-libs/animation';
import DOMHelper from './micro-libs/dom';
// import Mediator from './micro-libs/mediator';
// import Toolkit from './micro-libs/toolkit';
// import utils from './micro-libs/utils';
// import perf from './micro-libs/perf';

// const mediator = new Mediator();

/**
 * Arcadia object containing all micro libraries
 */

const Arcadia = {
  Ajax,
  DOMHelper,
  Animation,
  // mediator,
  // publish: mediator.publish.bind(mediator),
  // subscribe: mediator.subscribe.bind(mediator),
  // remove: mediator.remove.bind(mediator),
  // Toolkit,
  // utils
  // perf
};

export default Arcadia;

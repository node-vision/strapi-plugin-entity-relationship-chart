'use strict';

const myController = require('./my-controller');
const erc = require('./entity-relationship-chart');

module.exports = {
  myController,
  'entity-relationship-chart': erc,
};

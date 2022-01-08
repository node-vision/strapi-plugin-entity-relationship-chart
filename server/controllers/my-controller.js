'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi.plugin('strapi-plugin-entity-relationship-chart').service('myService').getWelcomeMessage();
  },
};

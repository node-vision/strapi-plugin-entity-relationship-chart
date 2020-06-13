'use strict';

/**
 * entity-relationship-chart.js controller
 *
 * @description: A set of functions called "actions" of the `entity-relationship-chart` plugin.
 */

const userPermissionModels = ['User', 'Role', 'Permission']

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    ctx.send({
      message: 'ok'
    });
  },

  getERData: async (ctx) => {
    const { models} = strapi;
    const data = [];
    Object.keys(models).forEach(modelKey => {
      const model = models[modelKey];
      data.push({name: model.info.name, attributes: model.attributes, key:modelKey});
    });
    userPermissionModels.forEach(name => {
      const model = strapi.query(name, 'users-permissions').model;
      data.push({name: name, attributes: model.attributes, key:model.info.name});
    });
    ctx.send({
      data
    });
  }
};

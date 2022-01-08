'use strict';

/**
 * entity-relationship-chart.js controller
 *
 * @description: A set of functions called "actions" of the `entity-relationship-chart` plugin.
 */

const userPermissionModels = ['User', 'Role', 'Permission'];

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    ctx.send({
      message: 'ok',
    });
  },

  getERData: async (ctx) => {
    const { models } = strapi.db.config;
    const data = models
      .filter((m) => m.kind === 'collectionType' && (!m.plugin || m.plugin === 'users-permissions'))
      .map((m) => ({
        name: m.info.singularName,
        attributes: m.attributes,
        key: m.info.singularName,
      }));
    ctx.send({
      data,
    });
  },
};

"use strict";

/**
 * entity-relationship-chart.js controller
 *
 * @description: A set of functions called "actions" of the `entity-relationship-chart` plugin.
 */

module.exports = {
  getERData: async (ctx) => {
    const { models } = strapi.db.config;
    const exclude = strapi.config.get('plugin.entity-relationship-chart.exclude')

    return models.filter(model => !exclude.includes(model.uid)).map((m) => ({
      name: m.tableName,
      attributes: m.attributes,
      key: m.uid,
      modelType: m.modelType,
      kind: m.kind,
    }));
  },
};

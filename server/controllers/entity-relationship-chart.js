"use strict";

/**
 * entity-relationship-chart.js controller
 *
 * @description: A set of functions called "actions" of the `entity-relationship-chart` plugin.
 */

module.exports = {
  getTablesRelationData: async (ctx) => {
    const exclude = strapi.config.get('plugin.entity-relationship-chart.exclude')
    const uids = Array.from(strapi.db.metadata.keys()).filter(uid => !exclude.includes(uid))

    return uids.map(uid => {
      const model = strapi.db.metadata.get(uid)

      return {
        key: model.uid,
        name: model.tableName,
        attributes: model.attributes,
        componentLink: model.componentLink,
        indexes: model.indexes,
        foreignKeys: model.foreignKeys,
        columnToAttribute: model.columnToAttribute,
      }
    })
  },
  getEntitiesRelationData: async (ctx) => {
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

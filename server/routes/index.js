module.exports = [
  {
    method: 'GET',
    path: '/er-data',
    handler: 'entity-relationship-chart.getEntitiesRelationData',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/tr-data',
    handler: 'entity-relationship-chart.getTablesRelationData',
    config: {
      policies: [],
    },
  },
];

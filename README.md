# Strapi plugin Entity Relationship Chart

Plugin displays Entity Relationship Diagram of all Strapi models, fields and relations.

![Preview](https://raw.githubusercontent.com/node-vision/strapi-plugin-entity-relationship-chart/master/preview.png)

## How to install:

1. In a root folder of your strapi project run `npm install strapi-plugin-entity-relationship-chart --save`
2. Rebuild admin UI `strapi build`
3. Run strapi `strapi develop`

## Exclude models from chart

You can exclude **contentTypes** or **components** from the chart by adding their ids to `exclude` plugin configuration property:

```js
// file: config/plugins.js
"use strict";

module.exports = () => ({
  // ...
  "entity-relationship-chart": {
    enabled: true,
    config: {
      // By default all contentTypes and components are included.
      // To exlclude strapi's internal models, use:
      exclude: [
        "strapi::core-store",
        "webhook",
        "admin::permission",
        "admin::user",
        "admin::role",
        "admin::api-token",
        "plugin::upload.file",
        "plugin::i18n.locale",
        "plugin::users-permissions.permission",
        "plugin::users-permissions.role",
      ],
    },
  },
  // ...
});
```

## Submitting issues:
Use github issues on the repo: - https://github.com/node-vision/strapi-plugin-entity-relationship-chart/issues

## Version Notes:

- this plugin was tested with stable Strapi - 4.0.6

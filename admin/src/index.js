import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const pluginName = pluginPkg.strapi.name || pluginPkg.name;
  const pluginIcon = pluginPkg.strapi.icon

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginIcon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    leftMenuLinks: [],
    menu: {
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon: pluginIcon,
          name: pluginName,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: pluginName,
          },
        },
      ],
    },
    leftMenuSections: [],
    mainComponent: App,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
  };

  return strapi.registerPlugin(plugin);
};


import _ from 'lodash';
import  { 
  DiagramEngine, 
  DiagramModel, 
  DefaultNodeModel,
  DefaultNodeFactory, 
  DefaultLinkFactory, 
  DefaultPortFactory, 
  DefaultLabelFactory 
} from './storm-react-diagrams';

export function drawEntityNodes(data, options) {
  const engine = new DiagramEngine();

  // engine.installDefaultFactories();
  engine.registerNodeFactory(new DefaultNodeFactory());
  engine.registerLinkFactory(new DefaultLinkFactory());
  engine.registerPortFactory(new DefaultPortFactory());
  engine.registerLabelFactory(new DefaultLabelFactory());
  
  const model = new DiagramModel();
  const nodes = [],
    nodesMap = {},
    links = [];

  // build nodes and ports
  for (const index in data) {
    const model = data[index];
    const color = model.modelType === 'component' ? 'rgb(255, 200, 0)' : model.kind === 'collectionType' ? 'rgb(0,126,255)' : 'rgb(85, 171, 0)'
    const node = new DefaultNodeModel(model.key, color);
    const ports = {};
    const attributes = Object.keys(model.attributes)

    ports.id = node.addInPort('id')

    for (const attr of attributes) {
      const fieldData = model.attributes[attr];
      const relation = fieldData.type === 'relation';
      const component = fieldData.type === 'component';
      const dynamiczone = fieldData.type === 'dynamiczone';
      
      if (relation) {
        ports[attr] = node.addOutPort(attr);
      } else if (component) {
        ports[attr] = node.addOutPort(attr);
      } else if (dynamiczone) {
        ports[attr] = node.addOutPort(attr);
      } else {
        //if scalar field
        ports[attr] = node.addInPort(attr);
      }
    }
    
    node.setPosition(0, 0);
    nodes.push(node);
    nodesMap[model.key] = { node, ports };
  }

  // build links
  for (const index in data) {
    const model = data[index];
    const { node, ports } = nodesMap[model.key]
    const attributes = Object.keys(model.attributes)

    for (const attr of attributes) {
      const fieldData = model.attributes[attr];
      const relation = fieldData.type === 'relation';
      const component = fieldData.type === 'component' && fieldData?.component;
      const dynamiczone = fieldData.type === 'dynamiczone' && fieldData?.components;
      const relationTarget = fieldData?.target
      // const relationField = fieldData.inversedBy || fieldData.morphBy || fieldData.mappedBy;
      
      if (relation && options.relations && relationTarget && nodesMap[relationTarget]) {
        //if relation
        const outPort = ports[attr]
        const link = outPort.link(nodesMap[relationTarget].ports.id);
        link.setColor('#999');
        links.push(link);
      } else if (component && nodesMap[component] && options.components) {
        //if component
        const outPort = ports[attr];
        const link = outPort.link(nodesMap[component].ports.id);
        link.setColor('#ffc800');
        links.push(link);
      } else if (dynamiczone && Array.isArray(dynamiczone) && options.dynamiczones) {
        //if dynamiczone
        for (const compId of dynamiczone) {
          if (nodesMap[compId]) {
            const outPort = ports[attr];
            const link = outPort.link(nodesMap[compId].ports.id);
            link.setColor('#ff6400');
            links.push(link);
          }
        }
      }
    }
    nodesMap[model.key] = { node, ports };
  }

  model.addAll(...nodes, ...links);
  engine.setDiagramModel(model);
  return { engine, model };
}
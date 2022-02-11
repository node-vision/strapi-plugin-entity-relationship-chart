import dagre from 'dagre';
import _ from 'lodash';
import * as SRD from './storm-react-diagrams';

const { 
  PointModel,
  DiagramEngine, 
  DiagramModel, 
  DefaultNodeModel,
  DefaultNodeFactory, 
  DefaultLinkFactory, 
  DefaultPortFactory, 
  DefaultLabelFactory 
} = SRD

export function autoLayout(engine, model) {
  // Create a new directed graph
  var g = new dagre.graphlib.Graph({
    multigraph: true,
    compound: true,
  });
  g.setGraph({
    align: 'DR',
    rankdir: 'RL',
    ranker: 'longest-path',
    marginx: 25,
    marginy: 25,
  });
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  // set nodes
  _.forEach(model.getNodes(), (node) => {
    g.setNode(node.getID(), { width: node.width, height: node.height });
  });

  _.forEach(model.getLinks(), (link) => {
    // set edges
    if (link.getSourcePort() && link.getTargetPort()) {
      g.setEdge({
        v: link.getSourcePort().getNode().getID(),
        w: link.getTargetPort().getNode().getID(),
        name: link.getID(),
      });
    }
  });

  // layout the graph
  dagre.layout(g);

  g.nodes().forEach((v) => {
    const node = g.node(v);
    model.getNode(v).setPosition(node.x - node.width / 2, node.y - node.height / 2);
  });

  g.edges().forEach((e) => {
    const edge = g.edge(e);
    const link = model.getLink(e.name);

    const points = [link.getFirstPoint()];
      for (let i = 1; i < edge.points.length - 1; i++) {
        points.push(new PointModel(link, { x: edge.points[i].x, y: edge.points[i].y }));
      }
    link.setPoints(points.concat(link.getLastPoint()));
  });
}

export function drawNodes(data, options) {
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
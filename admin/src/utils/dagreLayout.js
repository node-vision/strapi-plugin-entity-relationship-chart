import dagre from '@dagrejs/dagre';
import { 
  PointModel,
} from './storm-react-diagrams';

export function dagreLayout(model) {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph({
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
    g.setNode(node.getID(), {label: node.getID(), width: node.width, height: node.height });
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
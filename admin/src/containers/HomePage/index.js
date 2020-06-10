import React, {memo, useEffect, useState} from 'react';
import axios from 'axios';
import pluginId from '../../pluginId';
import * as SRD from "storm-react-diagrams";
import dagre from "dagre";
require("storm-react-diagrams/dist/style.min.css");
require("./main.css");

function autoLayout(engine, model){
  const options = {
    graph: {
      rankdir: 'RL',
      ranker: 'longest-path',
      marginx: 25,
      marginy: 25
    },
    includeLinks: true
  };
  // Create a new directed graph
  var g = new dagre.graphlib.Graph({
    multigraph: true
  });
  g.setGraph(options.graph );
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  const processedlinks = {};

  // set nodes
  _.forEach(model.getNodes(), (node) => {
    g.setNode(node.getID(), { width: node.width, height: node.height });
  });

  _.forEach(model.getLinks(), (link) => {
    // set edges
    if (link.getSourcePort() && link.getTargetPort()) {
      processedlinks[link.getID()] = true;
      g.setEdge({
        v: link.getSourcePort().getNode().getID(),
        w: link.getTargetPort().getNode().getID(),
        name: link.getID()
      });
    }
  });

  // layout the graph
  dagre.layout(g);
  g.nodes().forEach((v) => {
    const node = g.node(v);
    model.getNode(v).setPosition(node.x - node.width / 2, node.y - node.height / 2);
  });
  engine.repaintCanvas();
}

function drawNodes(data){
  const engine = new SRD.DiagramEngine();
  engine.installDefaultFactories();
  const model = new SRD.DiagramModel();
  const nodes = [], nodesMap = {}, links = [];

  data.forEach((model, index) => {
    const node = new SRD.DefaultNodeModel(model.name, "rgb(0,126,255)");
    const ports = {};
    Object.keys(model.attributes).forEach(attr => {
      const fieldData = model.attributes[attr];
      const relation = fieldData.collection || fieldData.model;
      const relationField = fieldData.via;
      //if relation
      if (relation && nodesMap[relation] && nodesMap[relation].ports[relationField]){
        const inPort = node.addInPort(attr);
        const link = inPort.link(nodesMap[relation].ports[relationField]);
        links.push(link)
      //if scalar field
      } else {
        ports[attr] = node.addOutPort(attr);
      }
    })
    node.setPosition(150 * index, 100);
    nodes.push(node);
    nodesMap[model.key] = {node, ports};
  });
  model.addAll(...nodes, ...links);
  engine.setDiagramModel(model);
  return {engine, model};
}

const HomePage = () => {
  const [engine, setEngine] = useState();
  useEffect(() => {
    async function getData(){
      const res = await axios.get('/entity-relationship-chart/er-data');
      const {engine, model} = drawNodes(res.data.data);
      setEngine(engine);
      autoLayout(engine, model);
    }
    getData();
  }, []);

  return (
    <div style={{padding: '25px 30px'}}>
      <div className="erc-header-title">
        <h1>Entity Relationship Chart</h1>
        <p>Displays Entity Relationship Diagram of all Strapi models, fields and relations.</p>
      </div>

      {engine && <SRD.DiagramWidget diagramEngine={engine}/>}
    </div>
  );
};

export default memo(HomePage);

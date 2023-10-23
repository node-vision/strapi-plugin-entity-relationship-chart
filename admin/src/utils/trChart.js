
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

export function drawDatabaseNodes(data, options) {
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

  const uidToName = (uid) => data?.find(d => d.key === uid)?.name;
  const nameTouid = (name) => data?.find(d => d.name === name)?.key;

  // build nodes and ports
  for (const index in data) {
    const model = data[index];
    const color = model.name.endsWith('_components') ? '#ff6400' : model.name.startsWith('components_') ? '#ffc800' : 'rgb(0,126,255)'
    const node = new DefaultNodeModel(model.name, color);
    const ports = {};
    const attributes = Object.keys(model.attributes)

    // ports.id = node.addInPort('id')

    for (const attr of attributes) {
      const fieldData = model.attributes[attr];
      const relation = fieldData.type === 'relation';
      
      if (relation) {
        ports[attr] = node.addOutPort(`*${attr}`);
      } else {
        //if scalar field
        ports[attr] = node.addInPort(attr);
      }
    }
    
    node.setPosition(0, 0);
    nodes.push(node);
    nodesMap[model.name] = { node, ports };
  }

  // extract joinTable nodes
  // for (const index in data) {
  //   const model = data[index];
  //   const attributes = Object.keys(model.attributes)
  //   for (const attr of attributes) {
  //     const fieldData = model.attributes[attr];
  //     const relation = fieldData.type === 'relation';
  //     const joinTable = fieldData.joinTable;
  //     if (relation && joinTable) {
  //       const {
  //         joinColumn,
  //         inverseJoinColumn,
  //         name,
  //         on,
  //         orderBy,
  //       } = joinTable

  //       if (!joinColumn) {
  //         console.log('joinColumn missing', joinTable);
  //         continue
  //       }

  //       if (nodesMap[name]) {
  //         console.log('joinTable already exists', name, joinTable);
  //         continue
  //       }
  //       console.log('CREATE already exists', name, joinTable);

  //       const node = new DefaultNodeModel(name, name.endsWith('_components') ? 'rgb(85, 171, 0)' : 'rgb(0,0,255)');
  //       const ports = {};

  //       ports[joinColumn.name] = node.addInPort(joinColumn.name);

  //       if (inverseJoinColumn) {
  //         ports[inverseJoinColumn.name] = node.addInPort(inverseJoinColumn.name);
  //       }

        
  //       node.setPosition(0, 0);
  //       nodes.push(node);
  //       nodesMap[name] = { node, ports };
  //     }
  //   }
  // }

  // build links
  for (const index in data) {
    const model = data[index];
    const { ports } = nodesMap[model.name]
    const foreignKeys = model.foreignKeys ?? []
    const attributes = Object.keys(model.attributes)

    // for (const keys of foreignKeys) {
    //   const reference = nodesMap[keys.referencedTable]
      
    //   if (!reference) {
    //     continue;
    //   }
    //   const outPort = reference.ports[keys.referencedColumns[0]]
    //   const inPort = ports[keys.columns[0]]

    //   const link = inPort.link(outPort);
    //   link.setColor('#999');
    //   links.push(link);
    // }


    for (const attr of attributes) {
      const fieldData = model.attributes[attr];
      const relation = fieldData.type === 'relation';
      const joinTable = fieldData.joinTable;
      if (relation && !joinTable) {
        // indexes
        const referencedTable = uidToName(fieldData.target)
        const reference = nodesMap[referencedTable]
        
        if (!reference) {
          continue;
        }
        const outPort = ports[attr]
        const inPort = reference.ports.id

        const link = outPort.link(inPort);
        link.setColor('#00FF00');
        links.push(link);
      } else if (relation && joinTable) {
        const {
          joinColumn,
          inverseJoinColumn,
          name,
          on,
          orderBy,
        } = joinTable

        if (!joinColumn) {
          continue;
        }
        if (!inverseJoinColumn) {
          // todo: morph
          //console.log('inverseJoinColumn missing', joinTable);
          continue;
        }
        
        const reference = nodesMap[name]
        if (!reference) {
          continue;
        }


        if (!on) {
        //   // const outPort = reference.ports.id
        //   const inPort = ports.id
        //   const outPort = reference.ports[inverseJoinColumn.name]
        //   const link = outPort.link(inPort);
        //   console.log('.......', reference.ports[joinColumn.name])
        //   link.setColor('#FF0000');
        //   links.push(link);
          continue
        }


        console.log({mn: model.name,attr, name, fieldData, on, joinColumn, inverseJoinColumn, reference});
        const outPort = ports[attr]
        const inPort = reference.ports.id
        const link = outPort.link(inPort);
        link.setColor('#FF00FF');
        links.push(link);

        
        // const referencedTable = uidToName(fieldData.target)
        // const reference = nodesMap[uidToName(fieldData.target)]

        const out2Port = reference.ports[inverseJoinColumn.name]
        const in2Port = nodesMap[uidToName(fieldData.target)]?.ports.id
        out2Port.in = false
        in2Port.in = true
        console.log({outPort, out2Port, inPort, in2Port});
        const link2 = out2Port.link(in2Port);
        link2.setColor('#00FFFF');
        links.push(link2);
        // const inPort = ports[on.target]
        // if (!inPort) {
        //   console.log('joinColumn missing44', joinTable);
        //   continue
        // }
        // const link = outPort.link(inPort);
        // console.log({attr, name, fieldData, on, inverseJoinColumn, reference, inPort, outPort});
        // link.setColor('#0000FF');
        // links.push(link);
          
        // const outPort = reference.ports.id
        // const inPort = ports[attr]
        // if (on) {
        //   console.log('on?', model.name, on);
        // }
        // if (inverseJoinColumn) {
        //   const outPort = ports[inverseJoinColumn.name];
        // }
        // console.log(joinTable)
      }
    }
  }

  model.addAll(...nodes, ...links);
  engine.setDiagramModel(model);
  return { engine, model };
}
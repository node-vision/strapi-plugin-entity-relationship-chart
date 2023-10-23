import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components'
import {
  useParams
} from "react-router-dom";
import { useIntl } from "react-intl";
import { ContentLayout, HeaderLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import getTrad from "../../utils/getTrad";
import { DiagramWidget } from '../../utils/storm-react-diagrams';
import { dagreLayout } from '../../utils/dagreLayout';
import { getTablesRelationData, getEntitiesRelationData } from '../../utils/requests';
import { drawEntityNodes } from '../../utils/erChart';
import { drawDatabaseNodes } from '../../utils/trChart';
import '../../utils/style.min.css';
import './main.css';

const Legend = styled.span`
  width: 12px;
  height: 3px;
  vertical-align: middle;
  display: inline-block;
  margin: 0 8px 0 4px;
  border-radius: 1px;

  background-color: ${props => props.color ? props.color : "#999"};
`;

const Icon = styled.span`
  svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;

    > g,
    path {
      fill: none
    }
  }
`
function FeatherDatabase(props) {
  return <Icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></g></svg>
  </Icon>
}

function FeatherBox(props) {
  return <Icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.27 6.96L12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></g></svg>
  </Icon>
}

function updateQuery(key, value) {
  const url = new URL(window.location);
  if (!value) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.pushState({}, '', url);
}

const HomePage = () => {
  const url = new URL(window.location);
  const [type, setType] = useState(url.searchParams.get('type'));
  const [engine, setEngine] = useState();
  const [erData, setERData] = useState();
  const [trData, setTRData] = useState();
  const [error, setError] = useState();
  const [relations, setRelations] = useState(true);
  const [components, setComponents] = useState(true);
  const [dynamiczones, setDynamiczones] = useState(true);

  const { formatMessage } = useIntl();
  const title = formatMessage({
    id: getTrad("name"),
    defaultMessage: "Entity Relationship Chart",
  });
  const subtitle = formatMessage({
    id: getTrad("description"),
    defaultMessage: "Displays Entity Relationship Diagram of all Strapi models, fields and relations.",
  });

  useEffect(() => {
    async function getData() {
      try {
        if (type === undefined && !erData) {
          setERData(await getEntitiesRelationData());
        } else if (type === 'database' && !trData) {
          setTRData(await getTablesRelationData());
        }
      } catch (e) {
        setError(e);
      }
    }
    getData();
  }, [type, setERData, setTRData, setError]);

  useEffect(() => {
    setEngine(null);
    setTimeout(() => {
      if (type === undefined && erData) {
        const { engine, model } = drawEntityNodes(erData, { relations, components, dynamiczones });
        setEngine(engine);
        setTimeout(() => {
          dagreLayout(model)
          engine.repaintCanvas();
        }, 0)
      } else if (type === 'database' && trData) {
        const { engine, model } = drawDatabaseNodes(trData, { relations, components, dynamiczones });
        setEngine(engine);
        setTimeout(() => {
          dagreLayout(model);
          engine.repaintCanvas();
        }, 0);

      }
    }, 0)
  }, [type, erData, trData, relations, components, dynamiczones]);

  useEffect(() => {
    updateQuery('type', type);
  }, [type])

  return (
    <main>
      <HeaderLayout
        title={title}
        subtitle={subtitle}
        primaryAction={
          type === undefined
            ? <Button startIcon={<FeatherDatabase />} onClick={() => setType('database')}>Switch to Database view</Button> 
            : <Button startIcon={<FeatherBox />} onClick={() => setType()}>Switch to API view</Button>
        }
      />
      <ContentLayout>
        {error && (
          <Box padding={7} background="neutral0" hasRadius>
            <h2>{error.toString()}</h2>
            <pre><code>{error.stack}</code></pre>
          </Box>
        )}
        {!error && (
          <>
            <Box padding={1}>
              <label>
                <input type="checkbox" checked={relations} onChange={(e) => setRelations(e.target.checked)} /> relations
                <Legend />
              </label>
              <label>
                <input type="checkbox" checked={components} onChange={(e) => setComponents(e.target.checked)} /> components
                <Legend color="#ffc800"/>
              </label>
              <label>
                <input type="checkbox" checked={dynamiczones} onChange={(e) => setDynamiczones(e.target.checked)} /> dynamiczones
                <Legend color="#ff6400" />
              </label>
            </Box>
            <Box background="neutral0" hasRadius style={{height: "80vh", width: "100%"}}>
              {engine && <DiagramWidget diagramEngine={engine} />}
            </Box>
          </>
        )}
      </ContentLayout>
    </main>
  );
};

export default memo(HomePage);

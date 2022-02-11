import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components'
import { request } from '@strapi/helper-plugin';
import { useIntl } from "react-intl";
import { ContentLayout, HeaderLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import getTrad from "../../utils/getTrad";
import pluginId from '../../pluginId';
import * as SRD from '../../utils/storm-react-diagrams';
import { drawNodes, autoLayout } from '../../utils/erChart';
import '../../utils/style.min.css';
import './main.css';

async function getERData() {
  return await request(`/${pluginId}/er-data`);
}

const Legend = styled.span`
  width: 12px;
  height: 3px;
  vertical-align: middle;
  display: inline-block;
  margin: 0 8px 0 4px;
  border-radius: 1px;

  
  background-color: ${props => props.color ? props.color : "#999"};
`;

const HomePage = () => {
  const [engine, setEngine] = useState();
  const [data, setData] = useState();
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
        const response = await getERData();
        setData(response);
      } catch (e) {
        setError(e);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    setEngine(null);
    setTimeout(() => {
      if (data) {
        const { engine, model } = drawNodes(data, { relations, components, dynamiczones });
        setEngine(engine);
        autoLayout(engine, model)
        engine.repaintCanvas();
      }
    }, 0)
  }, [data, relations, components, dynamiczones]);

  return (
    <main>
      <HeaderLayout
        title={title}
        subtitle={subtitle}
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
              {engine && <SRD.DiagramWidget diagramEngine={engine} />}
            </Box>
          </>
        )}
      </ContentLayout>
    </main>
  );
};

export default memo(HomePage);

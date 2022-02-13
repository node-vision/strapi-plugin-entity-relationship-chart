
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

export async function getEntitiesRelationData() {
  return await request(`/${pluginId}/er-data`);
}
export async function getTablesRelationData() {
  return await request(`/${pluginId}/tr-data`);
}
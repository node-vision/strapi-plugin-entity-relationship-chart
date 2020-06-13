
async function enableAuthPermissionForERData(){
  const roleAuthenticated = await strapi.query('Role', 'users-permissions').findOne({ name: 'Authenticated' });
  let permission = roleAuthenticated.permissions.find(p => p.controller === 'entity-relationship-chart' && p.action === 'geterdata');
  if (permission && !permission.enabled){
    await strapi.query('Permission', 'users-permissions').update({ id: permission.id }, { enabled: true });
  }
}

module.exports = async () => {
  await enableAuthPermissionForERData();
}

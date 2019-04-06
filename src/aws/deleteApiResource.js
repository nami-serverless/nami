const { asyncDeleteResource, asyncGetResources } = require('./awsFunctions');
const { readResources } = require('../util/fileUtils');

module.exports = async function deleteApiResource(resourceName, homedir) {
  const { restApiId } = await readResources(homedir);

  const getResourcesParams = {
    restApiId,
  };

  const namiApiGwResources = await asyncGetResources(getResourcesParams);

  const resource = namiApiGwResources.items.find(item => (
    item.pathPart === resourceName
  ));

  const resourceId = resource.id;

  const deleteResourceParams = {
    restApiId,
    resourceId,
  };

  try {
    await asyncDeleteResource(deleteResourceParams);
  } catch (err) {
    console.log('Delete API Resource Error =>', err.message);
  }
};

const { asyncDeleteResource, asyncGetResources } = require('./awsFunctions');
const { readResources } = require('../util/fileUtils');
const namiLog = require('../util/logger');

module.exports = async function deleteApiResource(resourceName, homedir) {
  try {
    const { restApiId } = await readResources(homedir);

    const getResourcesParams = {
      restApiId,
    };

    const namiApiGwResources = await asyncGetResources(getResourcesParams);

    const resource = namiApiGwResources.items.find(item => (
      item.pathPart === resourceName
    ));

    if (resource === undefined) {
      throw new Error(`API Gateway endpoint ${resourceName} doesn't exist`);
    }

    const resourceId = resource.id;

    const deleteResourceParams = {
      restApiId,
      resourceId,
    };

    await asyncDeleteResource(deleteResourceParams);
    namiLog(`API endpoint ${resourceName} deleted`);
  } catch (err) {
    return err.message;
  }
  return true;
};

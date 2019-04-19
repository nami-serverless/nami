const { asyncDeleteResource, asyncGetResources } = require('./awsFunctions');
const { readResources } = require('../util/fileUtils');
const namiLog = require('../util/logger');
const namiErr = require('../util/errorLogger');

module.exports = async function deleteApiResource(resourceName, homedir) {
  const { restApiId } = await readResources(homedir);

  const getResourcesParams = {
    restApiId,
  };

  try {
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
    namiLog(`API Gateway endpoint ${resourceName} deleted`);
  } catch (err) {
    namiErr(err.message);
  }
};

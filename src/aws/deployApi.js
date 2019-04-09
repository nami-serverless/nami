const uuid = require('uuid');
const createApiGatewayIntegration = require('./createApiGatewayIntegration');
const { getRegion } = require('../util/getRegion');
const { readResources, writeResources } = require('../util/fileUtils');

const {
  asyncCreateApi,
  asyncGetResources,
  asyncCreateResource,
  asyncCreateDeployment,
} = require('./awsFunctions');


module.exports = async function deployApi(resourceName, homedir, httpMethods, stageName) {
  const region = await getRegion();
  const description = 'API Gateway for all Nami framework API endpoints.';

  // deploy sequence:
  try {
    let { restApiId } = await readResources(homedir);

    // create rest api if it doesn't exist
    if (!restApiId) {
      restApiId = (await asyncCreateApi({ name: 'Nami', description })).id;

      await writeResources(homedir, 'restApiId', restApiId);
    }

    // get root resource
    const resources = (await asyncGetResources({ restApiId }));

    const rootResourceId = resources.items.find(resource => (
      resource.path === '/'
    )).id;

    const createResourceParams = {
      parentId: rootResourceId,
      pathPart: `${resourceName}`,
      restApiId,
    };

    // create path resource to allow path params
    const childResourceId = (await asyncCreateResource(createResourceParams)).id;

    const methodPermissionIds = {};
    for (let i = 0; i < httpMethods.length; i += 1) {
      const httpMethod = httpMethods[i];
      const apiPath = `/${resourceName}`;
      const childPermissionId = uuid.v4();

      methodPermissionIds[httpMethod] = {
        childPermissionId,
      };

      // child resource
      const childIntegrationParams = {
        httpMethod,
        restApiId,
        resourceName,
        homedir,
        resourceId: childResourceId,
        statementId: childPermissionId,
        apiPath,
      };

      await createApiGatewayIntegration(childIntegrationParams);
    }

    // create deployment
    // let { deploymentId } = await readResources(homedir);
    //
    // if (!deploymentId) {
    await asyncCreateDeployment({ restApiId, stageName });
      // deploymentId = deployment.id;
      // await writeResources(homedir, 'deploymentId', deploymentId);
    // }

    const endpoint = `https://${restApiId}.execute-api.${region}.amazonaws.com/${stageName}/${resourceName}`;
    console.log("API Gateway Endpoint:", `${endpoint}`);
    return {
      restApiId,
      endpoint,
      methodPermissionIds,
    };
  } catch (err) {
    console.log('Error deploying API => ', err.message);
  }
};

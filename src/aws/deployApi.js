const uuid = require('uuid');
const createApiGatewayIntegration = require('./createApiGatewayIntegration');
const { getRegion } = require('../util/getRegion');

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
    // create rest api
    const restApiId = (await asyncCreateApi({ name: 'Nami', description })).id;

    // get root resource
    const rootResourceId = (await asyncGetResources({ restApiId })).items[0].id;

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
    await asyncCreateDeployment({ restApiId, stageName });

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

const uuid = require('uuid');
const createApiGatewayIntegration = require('./createApiGatewayIntegration');
const { getRegion } = require('../util/getRegion');

const {
  asyncCreateApi,
  asyncGetResources,
  asyncCreateDeployment,
} = require('./awsFunctions');


module.exports = async function deployApi(resourceName, homedir, httpMethods, stageName) {
  const region = await getRegion();

  // deploy sequence:
  try {
    // create rest api
    const restApiId = (await asyncCreateApi({ name: resourceName })).id;

    // get root resource
    const rootResourceId = (await asyncGetResources({ restApiId })).items[0].id;

    const methodPermissionIds = {};
    for (let i = 0; i < httpMethods.length; i += 1) {
      const httpMethod = httpMethods[i];
      const rootPath = '/';
      const rootPermissionId = uuid.v4();

      methodPermissionIds[httpMethod] = {
        rootPermissionId,
      };

      // root resource
      const rootIntegrationParams = {
        httpMethod,
        restApiId,
        resourceName,
        homedir,
        resourceId: rootResourceId,
        statementId: rootPermissionId,
        apiPath: rootPath,
      };

      await createApiGatewayIntegration(rootIntegrationParams);
    }

    // create deployment
    await asyncCreateDeployment({ restApiId, stageName });

    const endpoint = `https://${restApiId}.execute-api.${region}.amazonaws.com/${stageName}`;

    return {
      restApiId,
      endpoint,
      methodPermissionIds,
    };
  } catch (err) {
    console.log(err);
  }
};

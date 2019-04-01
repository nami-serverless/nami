const { readConfig } = require('../util/fileUtils');
const { getRegion } = require('../util/getRegion');


const {
  asyncAddPermission,
  asyncPutMethod,
  asyncPutIntegration,
} = require('./awsFunctions');

module.exports = async function createApiGatewayIntegration({
  httpMethod,
  resourceId,
  restApiId,
  statementId,
  resourceName,
  apiPath,
  homedir,
}) {

  const config = await readConfig(homedir);
  const { accountNumber } = config;
  const region = getRegion();

  // add permission to lambda
  const sourceArn = `arn:aws:execute-api:${region}:${accountNumber}:${restApiId}/*/${httpMethod}${apiPath}`;
  const addPermissionParams = {
    FunctionName: resourceName,
    StatementId: statementId,
    Principal: 'apigateway.amazonaws.com',
    Action: 'lambda:InvokeFunction',
    SourceArn: sourceArn,
  };
  await asyncAddPermission(addPermissionParams);

  // put method
  const putMethodParams = {
    restApiId,
    resourceId,
    httpMethod,
    authorizationType: 'NONE',
  };
  await asyncPutMethod(putMethodParams);

  // put integration
  const putIntegrationParams = {
    restApiId,
    resourceId,
    httpMethod,
    type: 'AWS_PROXY',
    integrationHttpMethod: 'POST',
    uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${region}:${accountNumber}:function:${resourceName}/invocations`,
  };

  await asyncPutIntegration(putIntegrationParams);
};

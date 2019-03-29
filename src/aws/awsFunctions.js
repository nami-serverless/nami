const { promisify } = require('util');
const AWS = require('aws-sdk')
const apiVersion = 'latest';
const region = 'us-east-1';
const lambda = new AWS.Lambda({ apiVersion, region });
const api = new AWS.APIGateway({ apiVersion, region });

const asyncLambdaCreateFunction = promisify(lambda.createFunction.bind(lambda));
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncPutMethod = promisify(api.putMethod.bind(api));
const asyncPutIntegration = promisify(api.putIntegration.bind(api));
const asyncCreateApi = promisify(api.createRestApi.bind(api));
const asyncGetResources = promisify(api.getResources.bind(api));

module.exports = {
  asyncLambdaCreateFunction,
  asyncAddPermission,
  asyncPutMethod,
  asyncPutIntegration,
  asyncCreateApi,
  asyncGetResources,
};

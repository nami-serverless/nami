const { promisify } = require('util');
const AWS = require('aws-sdk')
const apiVersion = 'latest';
//const region = 'us-east-1'; // need to fix hard coding
const { getRegion } = require('../util/getRegion');
const region = getRegion();

const lambda = new AWS.Lambda({ apiVersion, region });
const api = new AWS.APIGateway({ apiVersion, region });
const ec2 = new AWS.EC2({ apiVersion, region });
const sts = new AWS.STS({ apiVersion, region });

const asyncLambdaCreateFunction = promisify(lambda.createFunction.bind(lambda));
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncPutMethod = promisify(api.putMethod.bind(api));
const asyncPutIntegration = promisify(api.putIntegration.bind(api));
const asyncCreateApi = promisify(api.createRestApi.bind(api));
const asyncGetResources = promisify(api.getResources.bind(api));
const asyncGetRegions = promisify(ec2.describeRegions.bind(ec2));
const asyncCreateKeyPair = promisify(ec2.createKeyPair.bind(ec2));
const asyncRunInstances = promisify(ec2.runInstances.bind(ec2));
const asyncGetCallerIdentity = promisify(sts.getCallerIdentity.bind(sts));
const asyncCreateDeployment = promisify(api.createDeployment.bind(api));


module.exports = {
  asyncLambdaCreateFunction,
  asyncAddPermission,
  asyncPutMethod,
  asyncPutIntegration,
  asyncCreateApi,
  asyncGetResources,
  asyncGetRegions,
  asyncGetCallerIdentity,
  asyncCreateDeployment,
  asyncCreateKeyPair,
  asyncRunInstances,
};

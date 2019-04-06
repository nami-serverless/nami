const { promisify } = require('util');
const AWS = require('aws-sdk')
const apiVersion = 'latest';
const { getRegion } = require('../util/getRegion');
const region = getRegion();

const lambda = new AWS.Lambda({ apiVersion, region });
const api = new AWS.APIGateway({ apiVersion, region });
const ec2 = new AWS.EC2({ apiVersion, region });
const sts = new AWS.STS({ apiVersion, region });
const sqs = new AWS.SQS({ apiVersion, region });
const iam = new AWS.IAM({ apiVersion, region });

// lambda
const asyncLambdaCreateFunction = promisify(lambda.createFunction.bind(lambda));
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncListEventSourceMappings = promisify(lambda.listEventSourceMappings.bind(lambda));
const asyncDeleteEventSourceMapping = promisify(lambda.deleteEventSourceMapping.bind(lambda));
const asyncCreateEventSourceMapping = promisify(lambda.createEventSourceMapping.bind(lambda));
const asyncPutFunctionConcurrency = promisify(lambda.putFunctionConcurrency.bind(lambda));

// api
const asyncCreateDeployment = promisify(api.createDeployment.bind(api));
const asyncPutMethod = promisify(api.putMethod.bind(api));
const asyncPutIntegration = promisify(api.putIntegration.bind(api));
const asyncCreateApi = promisify(api.createRestApi.bind(api));
const asyncGetResources = promisify(api.getResources.bind(api));

// ec2
const asyncGetRegions = promisify(ec2.describeRegions.bind(ec2));
const asyncCreateKeyPair = promisify(ec2.createKeyPair.bind(ec2));
const asyncRunInstances = promisify(ec2.runInstances.bind(ec2));
const asyncDescribeInstances = promisify(ec2.describeInstances.bind(ec2));
const asyncStopInstances = promisify(ec2.stopInstances.bind(ec2));
const asyncDescribeImages = promisify(ec2.describeImages.bind(ec2));
const asyncDescribeKeyPairs = promisify(ec2.describeKeyPairs.bind(ec2));

// sts
const asyncGetCallerIdentity = promisify(sts.getCallerIdentity.bind(sts));

// sqs
const asyncCreateSQS = promisify(sqs.createQueue.bind(sqs));
const asyncDeleteQueue = promisify(sqs.deleteQueue.bind(sqs));

// iam
const asyncCreateRole = promisify(iam.createRole.bind(iam));
const asyncCreatePolicy = promisify(iam.createPolicy.bind(iam));
const asyncAttachPolicy = promisify(iam.attachRolePolicy.bind(iam));
const asyncListRolePolicies = promisify(iam.listAttachedRolePolicies.bind(iam));
const asyncGetPolicy = promisify(iam.getPolicy.bind(iam));
const asyncGetRole = promisify(iam.getRole.bind(iam));
// const asyncDetachPolicy = promisify(iam.detachRolePolicy.bind(iam));
// const asyncDeleteRole = promisify(iam.deleteRole.bind(iam));
// const asyncDeletePolicy = promisify(iam.deletePolicy.bind(iam));
// const asyncListAttachedRolePolicies = promisify(iam.listAttachedRolePolicies.bind(iam));


module.exports = {
  asyncCreateRole,
  asyncAttachPolicy,
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
  asyncCreateSQS,
  asyncCreateEventSourceMapping,
  asyncPutFunctionConcurrency,
  asyncDescribeInstances,
  asyncStopInstances,
  asyncDescribeImages,
  asyncDescribeKeyPairs,
  asyncGetRole,
  asyncGetPolicy,
  asyncCreatePolicy,
  asyncDeleteEventSourceMapping,
  asyncListEventSourceMappings,
  asyncDeleteQueue,
  asyncListRolePolicies,
};

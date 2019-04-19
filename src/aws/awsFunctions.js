const { promisify } = require('util');
const AWS = require('aws-sdk')
const apiVersion = 'latest';
const getRegion = require('../util/getRegion');
const region = getRegion();

const lambda = new AWS.Lambda({ apiVersion, region });
const api = new AWS.APIGateway({ apiVersion, region });
const ec2 = new AWS.EC2({ apiVersion, region });
const sts = new AWS.STS({ apiVersion, region });
const sqs = new AWS.SQS({ apiVersion, region });
const iam = new AWS.IAM({ apiVersion, region });

// lambda
const asyncLambdaCreateFunction = promisify(lambda.createFunction.bind(lambda));
const asyncDeleteFunction = promisify(lambda.deleteFunction.bind(lambda));
const asyncAddPermission = promisify(lambda.addPermission.bind(lambda));
const asyncListEventSourceMappings = promisify(lambda.listEventSourceMappings.bind(lambda));
const asyncDeleteEventSourceMapping = promisify(lambda.deleteEventSourceMapping.bind(lambda));
const asyncCreateEventSourceMapping = promisify(lambda.createEventSourceMapping.bind(lambda));
const asyncPutFunctionConcurrency = promisify(lambda.putFunctionConcurrency.bind(lambda));
const asyncGetFunction = promisify(lambda.getFunction.bind(lambda));
const asyncInvokeLambda = promisify(lambda.invoke.bind(lambda));

// api
const asyncCreateDeployment = promisify(api.createDeployment.bind(api));
const asyncPutMethod = promisify(api.putMethod.bind(api));
const asyncPutIntegration = promisify(api.putIntegration.bind(api));
const asyncCreateApi = promisify(api.createRestApi.bind(api));
const asyncGetResources = promisify(api.getResources.bind(api));
const asyncCreateResource = promisify(api.createResource.bind(api));
const asyncDeleteResource = promisify(api.deleteResource.bind(api));

// ec2
const asyncGetRegions = promisify(ec2.describeRegions.bind(ec2));
const asyncCreateKeyPair = promisify(ec2.createKeyPair.bind(ec2));
const asyncRunInstances = promisify(ec2.runInstances.bind(ec2));
const asyncDescribeInstances = promisify(ec2.describeInstances.bind(ec2));
const asyncStopInstances = promisify(ec2.stopInstances.bind(ec2));
const asyncDescribeImages = promisify(ec2.describeImages.bind(ec2));
const asyncDescribeKeyPairs = promisify(ec2.describeKeyPairs.bind(ec2));
const asyncCreateSecurityGroup = promisify(ec2.createSecurityGroup.bind(ec2));
const asyncDescribeVpcs = promisify(ec2.describeVpcs.bind(ec2));
const asyncDescribeSubnets = promisify(ec2.describeSubnets.bind(ec2));
const asyncAuthorizeSecurityGroupIngress = promisify(ec2.authorizeSecurityGroupIngress.bind(ec2));
const asyncTerminateInstances = promisify(ec2.terminateInstances.bind(ec2));
const asyncDeleteSecurityGroup = promisify(ec2.deleteSecurityGroup.bind(ec2));
const asyncDescribeSecurityGroups = promisify(ec2.describeSecurityGroups.bind(ec2));

// sts
const asyncGetCallerIdentity = promisify(sts.getCallerIdentity.bind(sts));

// sqs
const asyncCreateSQS = promisify(sqs.createQueue.bind(sqs));
const asyncDeleteQueue = promisify(sqs.deleteQueue.bind(sqs));
const asyncGetQueueAttributes = promisify(sqs.getQueueAttributes.bind(sqs));
const asyncListQueues = promisify(sqs.listQueues.bind(sqs));
const asyncReceiveMessage = promisify(sqs.receiveMessage.bind(sqs));

// iam
const asyncCreateRole = promisify(iam.createRole.bind(iam));
const asyncCreatePolicy = promisify(iam.createPolicy.bind(iam));
const asyncAttachPolicy = promisify(iam.attachRolePolicy.bind(iam));
const asyncListRolePolicies = promisify(iam.listAttachedRolePolicies.bind(iam));
const asyncGetPolicy = promisify(iam.getPolicy.bind(iam));
const asyncGetRole = promisify(iam.getRole.bind(iam));

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
  asyncDeleteFunction,
  asyncCreateResource,
  asyncDeleteResource,
  asyncCreateSecurityGroup,
  asyncDescribeVpcs,
  asyncDescribeSubnets,
  asyncAuthorizeSecurityGroupIngress,
  asyncTerminateInstances,
  asyncDeleteSecurityGroup,
  asyncDescribeSecurityGroups,
  asyncGetFunction,
  asyncGetQueueAttributes,
  asyncListQueues,
  asyncReceiveMessage,
  asyncInvokeLambda,
};

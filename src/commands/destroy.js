const deleteApiResource = require('../aws/deleteApiResource');
const deleteLambda = require('../aws/deleteLambda');
const deleteSQS = require('../aws/deleteSQS');
const deleteEventSourceMapping = require('../aws/deleteEventSourceMapping');
const terminateEC2Instance = require('../aws/terminateEC2Instance');
const deleteSecurityGroup = require('../aws/deleteSecurityGroup');

module.exports = async function destroy(resourceName, options, homedir) {
  const preLambda = `${resourceName}PreLambda`;
  const postLambda = `${resourceName}PostLambda`;
  const securityGroupEC2 = `${resourceName}EC2SecurityGroup`;
  const securityGroupPostLambda = `${resourceName}PostLambdaSecurityGroup`;

  console.log('Waiting for EC2 instance to terminate')
  await terminateEC2Instance(resourceName);
  console.log('EC2 instance terminated. EBS volume persists for data preservation');

  await deleteSecurityGroup(securityGroupEC2);
  await deleteSecurityGroup(securityGroupPostLambda);
  console.log('Security groups deleted');
  await deleteEventSourceMapping(resourceName);

  await deleteSQS(resourceName, homedir);
  console.log('SQS queue deleted');

  await deleteLambda(preLambda);
  await deleteLambda(postLambda);
  console.log('Lambda functions deleted');

  await deleteApiResource(resourceName, homedir);
  console.log(`API Gateway endpoint ${resourceName} deleted`);
};

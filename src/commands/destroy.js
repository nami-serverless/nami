const deleteApiResource = require('../aws/deleteApiResource');
const deleteLambda = require('../aws/deleteLambda');
const deleteSQS = require('../aws/deleteSQS');
const deleteEventSourceMapping = require('../aws/deleteEventSourceMapping');
const stopEC2Instance = require('../aws/stopEC2Instance');

module.exports = async function destroy(resourceName, options, homedir) {
  const preLambda = `${resourceName}PreLambda`;
  const postLambda = `${resourceName}PostLambda`;

  await stopEC2Instance(resourceName);
  console.log('EC2 instance terminated. EBS volume persists for data preservation');

  await deleteEventSourceMapping(resourceName);

  await deleteSQS(resourceName, homedir);
  console.log('SQS queue deleted');

  await deleteLambda(preLambda);
  await deleteLambda(postLambda);
  console.log('Lambda functions deleted');

  await deleteApiResource(resourceName, homedir);
  console.log(`API Gateway endpoint ${resourceName} deleted`);
};

const deleteApiResource = require('../aws/deleteApiResource');
const deleteLambda = require('../aws/deleteLambda');
const deleteSQS = require('../aws/deleteSQS');
const deleteDLQ = require('../aws/deleteDLQ');
const deleteEventSourceMapping = require('../aws/deleteEventSourceMapping');
const terminateEC2Instance = require('../aws/terminateEC2Instance');
const deleteSecurityGroup = require('../aws/deleteSecurityGroup');

module.exports = async function destroy(resourceName, homedir) {
  const preLambda = `${resourceName}PreLambda`;
  const postLambda = `${resourceName}PostLambda`;
  const securityGroupEC2 = `${resourceName}EC2SecurityGroup`;
  const securityGroupPostLambda = `${resourceName}PostLambdaSecurityGroup`;

  await terminateEC2Instance(resourceName);

  await deleteSecurityGroup(securityGroupEC2);
  await deleteSecurityGroup(securityGroupPostLambda);

  await deleteEventSourceMapping(resourceName);

  await deleteDLQ(resourceName, homedir);
  await deleteSQS(resourceName, homedir);

  await deleteLambda(preLambda);
  await deleteLambda(postLambda);

  await deleteApiResource(resourceName, homedir);
};

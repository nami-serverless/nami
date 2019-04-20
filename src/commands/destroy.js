const deleteApiResource = require('../aws/deleteApiResource');
const deleteLambda = require('../aws/deleteLambda');
const deleteSQS = require('../aws/deleteSQS');
const deleteDLQ = require('../aws/deleteDLQ');
const deleteEventSourceMapping = require('../aws/deleteEventSourceMapping');
const terminateEC2Instance = require('../aws/terminateEC2Instance');
const deleteSecurityGroup = require('../aws/deleteSecurityGroup');
const deleteStagingDir = require('../util/deleteStagingDir');
const namiLog = require('../util/logger');

module.exports = async function destroy(resourceName, homedir) {
  const preLambda = `${resourceName}PreLambda`;
  const postLambda = `${resourceName}PostLambda`;
  const securityGroupEC2 = `${resourceName}EC2SecurityGroup`;
  const securityGroupPostLambda = `${resourceName}PostLambdaSecurityGroup`;

  namiLog('Starting destroy sequence');
  await deleteStagingDir(preLambda, homedir);
  await deleteStagingDir(postLambda, homedir);

  await terminateEC2Instance(resourceName);

  await deleteSecurityGroup(securityGroupEC2);
  await deleteSecurityGroup(securityGroupPostLambda);

  await deleteEventSourceMapping(resourceName);

  await deleteDLQ(resourceName, homedir);
  await deleteSQS(resourceName, homedir);

  await deleteLambda(preLambda);
  await deleteLambda(postLambda);

  await deleteApiResource(resourceName, homedir);
  namiLog('Destroy sequence complete');
};

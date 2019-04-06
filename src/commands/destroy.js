const deleteApiResource = require('../aws/deleteApi');
const deleteLambda = require('../aws/deleteLambda');
const deleteSQS = require('../aws/deleteSQS');
const deleteEventSourceMapping = require('../aws/deleteEventSourceMapping');
const stopEC2Instance = require('../aws/stopEC2Instance');

module.exports = async function destroy(resourceName, options, homedir) {
  const preLambda = `${resourceName}PreLambda`;
  const postLambda = `${resourceName}PostLambda`;

  await stopEC2Instance(resourceName);
  await deleteEventSourceMapping(resourceName);
  await deleteSQS(resourceName, homedir);
  await deleteLambda(preLambda);
  await deleteLambda(postLambda);
  await deleteApiResource(resourceName);
};

const deleteApi = require('../aws/deleteApi');
const deleteAwsLambdas = require('../aws/deleteLambdas');
const deleteSQS = require('../aws/deleteSQS');
const deleteEventSourceMapping = require('../aws/deleteEventSourceMapping');
const stopEC2Instance = require('../aws/stopEC2Instance');

module.exports = async function destroy(resourceName, options, homedir) {
  await stopEC2Instance(resourceName);
  await deleteEventSourceMapping(resourceName);
  await deleteSQS(resourceName, homedir);
  // await deleteLambda(resourceName);
  // await deleteApi(resourceName);
};

const { asyncStopInstances } = require('./awsFunctions');
const getInstanceId = require('./../util/getInstanceId');

module.exports = async function stopEC2Instance(resourceName) {
  const instanceId = await getInstanceId(resourceName);

  const stopInstancesParams = {
    InstanceIds: [instanceId],
  };

  await asyncStopInstances(stopInstancesParams);
};

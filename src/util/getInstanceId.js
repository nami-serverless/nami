const { asyncDescribeInstances } = require('../aws/awsFunctions');

module.exports = async function getInstanceId(resourceName) {
  const tagValue = `${resourceName}EC2`;
  const describeInstancesParams = {
    Filters: [
      {
        Name: 'tag:Nami',
        Values: [tagValue],
      },
      {
        Name: 'instance-state-name',
        Values: ['running', 'pending'],
      },
    ],
  };

  try {
    const runningInstance = await asyncDescribeInstances(describeInstancesParams);

    const instanceId = runningInstance.Reservations[0].Instances[0].InstanceId;
    return instanceId;
  } catch (err) {
    console.log('Describe Instances error =>', err.message);
  }
};

const { asyncDescribeInstances } = require('../aws/awsFunctions');

const getEC2PrivateIp = async (instanceId) => {
  try {
    const describeInstancesParams = {
      InstanceIds: [
        `${instanceId}`
      ]
    };
    const data = await asyncDescribeInstances(describeInstancesParams);
    const privateIp = data.Reservations[0].Instances[0].PrivateIpAddress;
    return privateIp;
  } catch (err) {
    console.log(err);
  }
};


module.exports = {
  getEC2PrivateIp,
};

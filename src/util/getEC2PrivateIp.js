const { asyncDescribeInstances } = require('../aws/awsFunctions');
const namiErr = require('./../util/errorLogger');

const getEC2PrivateIp = async (instanceId) => {
  try {
    const describeInstancesParams = {
      InstanceIds: [
        `${instanceId}`,
      ],
    };
    const data = await asyncDescribeInstances(describeInstancesParams);
    const privateIp = data.Reservations[0].Instances[0].PrivateIpAddress;
    return privateIp;
  } catch (err) {
    namiErr('Error retrieving EC2 private IP => ', err.message);
    return err.message;
  }
};


module.exports = {
  getEC2PrivateIp,
};

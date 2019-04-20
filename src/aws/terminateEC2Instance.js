const { asyncTerminateInstances } = require('./awsFunctions');
const getInstanceId = require('../util/getInstanceId');
const sleep = require('../util/sleep');

const namiLog = require('../util/logger');

module.exports = async function terminateEC2Instance(resourceName) {
  let ec2ShutdownComplete = false;
  let terminatedStatusCode;
  let data;

  try {
    const instanceId = await getInstanceId(resourceName);

    const terminateInstancesParams = {
      InstanceIds: [instanceId],
    };

    if (instanceId) {
      namiLog('Waiting for EC2 instance to terminate');
      while (!ec2ShutdownComplete) {
        data = await asyncTerminateInstances(terminateInstancesParams);
        terminatedStatusCode = data.TerminatingInstances[0].CurrentState.Code;

        if (terminatedStatusCode === 48) {
          ec2ShutdownComplete = true;
        }
        await sleep(2000);
      }
    } else {
      throw new Error('EC2 instance does not exist');
    }

    namiLog('EC2 instance terminated. EBS volume persists for data preservation');
  } catch (err) {
    return err;
  }
  return true;
};

const AWS = require('aws-sdk');
const { getRegion } = require('../util/getRegion');
const {
  asyncCreateKeyPair,
  asyncRunInstances,
} = require('./awsFunctions');

const { createKeyPairFile } = require('../util/fileUtils');

const region = getRegion();
const apiVersion = 'latest';
const KeyName = 'nami';

const ec2 = new AWS.EC2({ region, apiVersion });



module.exports = async function deployEC2(homedir) {
	const namiKeyPair = await asyncCreateKeyPair({ KeyName });
  await createKeyPairFile(homedir, namiKeyPair);

	const instanceParams = {
    KeyName,
    ImageId: 'ami-021bca21916e3c748',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
	};

  const newInstance = await asyncRunInstances(instanceParams);
  const instanceId = newInstance.Instances[0].InstanceId;
  console.log("Created instance", instanceId);


}

const AWS = require('aws-sdk');
const { getRegion } = require('../util/getRegion');
const os = require('os');

const {
  asyncCreateKeyPair,
  asyncRunInstances,
} = require('./awsFunctions');

const {
  createKeyPairFile,
  getNamiPath,
  readFile,
} = require('../util/fileUtils');

const namiPath = getNamiPath(os.homedir());

const region = getRegion();
const apiVersion = 'latest';
const KeyName = 'nami';

const ec2 = new AWS.EC2({ region, apiVersion });

module.exports = async function deployEC2(homedir) {
  // ignore keypair if exists
	const namiKeyPair = await asyncCreateKeyPair({ KeyName });
  await createKeyPairFile(homedir, namiKeyPair);

  const data = await readFile(`${namiPath}/docker_mongo_setup.sh`);
  const UserData = data.toString('base64');

  // find relevant AMI Image ID

	const instanceParams = {
    KeyName,
    ImageId: 'ami-0a313d6098716f372',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    UserData,
	};

  const newInstance = await asyncRunInstances(instanceParams);
  const instanceId = newInstance.Instances[0].InstanceId;
  console.log("EC2 instance deployed: ", instanceId);
  return instanceId;
}

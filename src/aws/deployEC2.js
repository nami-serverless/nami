const AWS = require('aws-sdk');
const { getRegion } = require('../util/getRegion');
const os = require('os');
const getMostRecentUbuntuImageId = require('./../util/getMostRecentUbuntuImageId');

const {
  asyncCreateKeyPair,
  asyncRunInstances,
  asyncDescribeKeyPairs,
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
  try {
    await asyncDescribeKeyPairs({ KeyNames: ['nami']});
  } catch {
    const namiKeyPair = await asyncCreateKeyPair({ KeyName });
    await createKeyPairFile(homedir, namiKeyPair);
  }

  const data = await readFile(`${namiPath}/docker_mongo_setup.sh`);
  const UserData = data.toString('base64');

  const imageId = await getMostRecentUbuntuImageId();

	const instanceParams = {
    KeyName,
    ImageId: `${imageId}`,
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    UserData,
    TagSpecifications: [
     {
      ResourceType: "instance", 
      Tags: [
        {
        Key: "Name", 
        Value: "namiEC2"
       }
      ]
     }
    ]
	};

  const newInstance = await asyncRunInstances(instanceParams);
  const instanceId = newInstance.Instances[0].InstanceId;
  console.log("EC2 instance deployed: ", instanceId);
  return instanceId;
}

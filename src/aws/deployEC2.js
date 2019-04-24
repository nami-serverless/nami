const os = require('os');
const getMostRecentUbuntuImageId = require('../util/getMostRecentUbuntuImageId');
const namiLog = require('../util/logger');
const deploySecurityGroup = require('./deploySecurityGroup');

const {
  asyncCreateKeyPair,
  asyncRunInstances,
  asyncDescribeKeyPairs,
  asyncAuthorizeSecurityGroupIngress,
} = require('./awsFunctions');

const {
  createKeyPairFile,
  getNamiPath,
  readFile,
  changePermissionsOnKeyPairFile,
  copyFile,
  exists,
} = require('../util/fileUtils');

const namiPath = getNamiPath(os.homedir());

const KeyName = 'nami';


module.exports = async function deployEC2(resourceName, homedir) {
  let namiKeyPair;
  const keyLogMessageOne = 'nami.pem private key has been saved in your current directory';
  const keyLogMessageTwo = 'You will need it for SSH connections to any Nami EC2 instance';

  try {
    await asyncDescribeKeyPairs({ KeyNames: [`${KeyName}`] });
    const destinationFile = `${process.cwd()}/nami.pem`;
    const pemFileExists = await exists(destinationFile);

    if (!pemFileExists) {
      const sourceFile = `${namiPath}/nami.pem`;
      //console.log(sourceFile, destinationFile);
      await copyFile(sourceFile, destinationFile);
      namiLog(keyLogMessageOne);
      namiLog(keyLogMessageTwo);
    }
  } catch (err) {
    //console.log('am in the catch block');
    namiKeyPair = await asyncCreateKeyPair({ KeyName });
    await createKeyPairFile(homedir, namiKeyPair);
    await changePermissionsOnKeyPairFile(homedir, namiKeyPair);
    namiLog(keyLogMessageOne);
    namiLog(keyLogMessageTwo);
  }

  const data = await readFile(`${namiPath}/docker_mongo_setup.sh`);
  const UserData = data.toString('base64');

  const imageId = await getMostRecentUbuntuImageId();

  const SecurityGroupId = await deploySecurityGroup(resourceName, 'ec2');

  const authorizeSecurityGroupIngressParams = {
    GroupId: SecurityGroupId,
    IpPermissions: [
      {
        FromPort: 27017,
        IpProtocol: 'tcp',
        ToPort: 27017,
        UserIdGroupPairs: [
          {
            Description: 'Inbound Access from Nami Post Lambda Function',
            GroupName: `${resourceName}PostLambdaSecurityGroup`,
          },
        ],
      },
    ],
  };

  await asyncAuthorizeSecurityGroupIngress(authorizeSecurityGroupIngressParams);

  const instanceParams = {
    KeyName,
    ImageId: `${imageId}`,
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    UserData,
    SecurityGroupIds: [SecurityGroupId],
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Nami',
            Value: `${resourceName}EC2`,
          },
        ],
      },
    ],
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/sda1',
        Ebs: {
          VolumeSize: 100,
          DeleteOnTermination: false,
        },
      },
    ],
  };

  const newInstance = await asyncRunInstances(instanceParams);
  const instanceId = newInstance.Instances[0].InstanceId;
  namiLog('EC2 instance with MongoDB deployed');
  return instanceId;
};

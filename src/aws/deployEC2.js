const AWS = require('aws-sdk');
const { getRegion } = require('../util/getRegion');
const os = require('os');
const getMostRecentUbuntuImageId = require('./../util/getMostRecentUbuntuImageId');
const createSecurityGroup = require('./../util/createSecurityGroup');
const getDefaultVpcId = require('./../util/getDefaultVpcId');

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
} = require('../util/fileUtils');

const namiPath = getNamiPath(os.homedir());

const region = getRegion();
const apiVersion = 'latest';
const KeyName = 'nami';

const ec2 = new AWS.EC2({ region, apiVersion });

module.exports = async function deployEC2(resourceName, homedir) {
  try {
    await asyncDescribeKeyPairs({ KeyNames: [`${KeyName}`]});
  } catch {
    const namiKeyPair = await asyncCreateKeyPair({ KeyName });
    await createKeyPairFile(homedir, namiKeyPair);
    await changePermissionsOnKeyPairFile(homedir, namiKeyPair);
  }

  const data = await readFile(`${namiPath}/docker_mongo_setup.sh`);
  const UserData = data.toString('base64');

  const imageId = await getMostRecentUbuntuImageId();

  const defaultVpcID = await getDefaultVpcId();

  const description = 'Security Group for EC2 Instance in Nami Framework';
  const groupName = `${resourceName}EC2SecurityGroup`;
  const SecurityGroupId = await createSecurityGroup(description, groupName, defaultVpcID);

  const authorizeSecurityGroupIngressParams = {
    GroupId: SecurityGroupId,
    IpPermissions: [
       {
        FromPort: 27017,
        IpProtocol: "tcp",
        ToPort: 27017,
        UserIdGroupPairs: [
          {
            Description: "Inbound Access from Nami Post Lambda Function",
            GroupName:`${resourceName}PostLambdaSecurityGroup`,
          }
        ]
      }
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
      ResourceType: "instance",
      Tags: [
        {
          Key: "Nami",
          Value: `${resourceName}EC2`
        }
      ]
     }
   ],
   BlockDeviceMappings: [
     {
       DeviceName: '/dev/sda1',
       Ebs: {
         VolumeSize: 100,
       },
     },
   ],
	};


  const newInstance = await asyncRunInstances(instanceParams);
  const instanceId = newInstance.Instances[0].InstanceId;
  console.log("EC2 instance deployed: ", instanceId);
  return instanceId;
}

const os = require('os');

const homedir = os.homedir();
const getInstanceId = require('./../src/util/getInstanceId');
const getMostRecentUbuntuImageId = require('./../src/util/getMostRecentUbuntuImageId');
const deployEC2 = require('./../src/aws/deployEC2');
const {
  asyncDescribeInstances,
  asyncDescribeKeyPairs,
  asyncDescribeSecurityGroups,
} = require('./../src/aws/awsFunctions');
const deploySecurityGroup = require('./../src/aws/deploySecurityGroup');
const deleteSecurityGroup = require('./../src/aws/deleteSecurityGroup');
const terminateEC2Instance = require('./../src/aws/terminateEC2Instance');

describe('ec2 is deployed', () => {
  let instanceId;
  let instance;
  jest.setTimeout(15000);

  beforeAll(async () => {
    await deploySecurityGroup('test', 'lambda');
    jest.setTimeout(15000);
    await deployEC2('test', homedir);
  });

  test('keypair exists', async (done) => {
    const keyPairExists = await asyncDescribeKeyPairs({ KeyNames: ['nami'] });
    expect(typeof keyPairExists).toBe('object');

    done();
  });

  test('instance exists', async () => {
    instanceId = await getInstanceId('test');
    expect(typeof instanceId).toBe('string');
  });

  test('ec2 security group allows postLambda security group ingress', async () => {
    const securityGroupName = 'testEC2SecurityGroup';
    const securityGroups = await asyncDescribeSecurityGroups({ GroupNames: [securityGroupName] });
    const securityGroupIpPermissions = securityGroups.SecurityGroups[0].IpPermissions;
    const userIdGroupPairsDescription = securityGroupIpPermissions[0]
      .UserIdGroupPairs[0].Description;

    expect(userIdGroupPairsDescription).toBe('Inbound Access from Nami Post Lambda Function');
  });

  describe('instance is configured according to params', () => {
    test('instance ImageId is latest Ubuntu image ID', async () => {
      const latestUbuntuImageId = await getMostRecentUbuntuImageId();
      const instances = await asyncDescribeInstances({ InstanceIds: [instanceId] });
      [instance] = instances.Reservations[0].Instances;
      const imageId = instance.ImageId;
      expect(latestUbuntuImageId).toBe(imageId);
    });

    test('instance has attached EBS volume that is preserved on termination', async () => {
      expect(instance.BlockDeviceMappings[0].Ebs.DeleteOnTermination).toBe(false);
    });
  });

  afterAll(async () => {
    await terminateEC2Instance('test');
    jest.setTimeout(15000);

    await deleteSecurityGroup('testEC2SecurityGroup');
    await deleteSecurityGroup('testPostLambdaSecurityGroup');
  });
});

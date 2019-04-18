const deploySecurityGroup = require('./../src/aws/deploySecurityGroup');
const getDefaultVpcId = require('./../src/util/getDefaultVpcId');
const deleteSecurityGroup = require('./../src/aws/deleteSecurityGroup');
const { asyncDescribeSecurityGroups } = require('./../src/aws/awsFunctions');

describe('deploySecurityGroup', () => {
  let securityGroupId;
  let testSecurityGroup;
  let defaultVpcID;

  beforeAll(async () => {
    securityGroupId = await deploySecurityGroup('test2', 'ec2');
    const describeSecurityGroupsParams = { GroupIds: [securityGroupId] };
    const testSecurityGroups = await asyncDescribeSecurityGroups(describeSecurityGroupsParams);
    testSecurityGroup = testSecurityGroups.SecurityGroups[0];
    defaultVpcID = await getDefaultVpcId();
  });

  test('security group exists', async () => {
    expect(securityGroupId.slice(0, 2)).toBe('sg');
  });

  test('security group has appropriate description for type', async () => {
    expect(testSecurityGroup.Description).toEqual('Security Group for EC2 Instance in Nami Framework');
  });

  test('security group has appropriate name for type', async () => {
    expect(testSecurityGroup.GroupName).toEqual('test2EC2SecurityGroup');
  });

  test('security group has default VPC id', async () => {
    expect(testSecurityGroup.VpcId).toBe(defaultVpcID);
  });

  afterAll(async () => {
    await deleteSecurityGroup('test2EC2SecurityGroup');
  });
});

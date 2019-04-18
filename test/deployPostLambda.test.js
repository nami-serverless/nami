const deployPostLambda = require('../src/aws/deployPostLambda');
const deployEC2 = require('../src/aws/deployEC2');
const deploySecurityGroup = require('../src/aws/deploySecurityGroup');

const { doesLambdaExist } = require('../src/aws/doesResourceExist');

const os = require('os');

const resourceName = 'testing';
const securityGroupType = 'lambda';
const homedir = os.homedir();
let instanceId;
let lambdaType;
let SecurityGroupId;

describe('Nami deploy Post Lambda', () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    instanceId = await deployEC2(resourceName, homedir);
    SecurityGroupId = await deploySecurityGroup(resourceName, securityGroupType);
    jest.setTimeout(30000);
    await deployPostLambda(resourceName, homedir, instanceId, SecurityGroupId);
  });

  afterAll(async() => {

  });

  test('Lambda can connect to database', async() => {
    // create ec2 instance with mongodb
    // connect to mongodb
  });

  test.only('Lambda exists on AWS', async() => {
    lambdaType = 'PostLambda';
    const lambda = await doesLambdaExist(resourceName, lambdaType);
    expect(lambda).toBe(true);
  });
});
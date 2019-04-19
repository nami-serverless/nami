const os = require('os');

const deployEC2 = require('../src/aws/deployEC2');
const deployPostLambda = require('../src/aws/deployPostLambda');
const deploySecurityGroup = require('../src/aws/deploySecurityGroup');
//const deployDLQ = require('../src/aws/deployDLQ');
//const deploySQS = require('../src/aws/deploySQS');
const { doesLambdaExist } = require('../src/aws/doesResourceExist');
const destroy = require('../src/commands/destroy');

const {
  getStagingPath,
  exists,
  readConfig,
} = require('../src/util/fileUtils');

const resourceName = 'testNami1005';
const postLambdaName = `${resourceName}PostLambda`;
//const sqsName = `${resourceName}SQS`;
const homedir = os.homedir();
const stagingPath = getStagingPath(homedir);

// don't forget to deploy Q!
describe('Nami deploy Post Lambda', () => {
  let instanceId;
  let securityGroupId;

  jest.setTimeout(60000);
  beforeAll(async () => {
    jest.setTimeout(15000);
    securityGroupId = await deploySecurityGroup(resourceName, 'lambda');
    instanceId = await deployEC2(resourceName, homedir);
    await deployPostLambda(resourceName, homedir, instanceId, securityGroupId);
  });

  afterAll(async () => {
    await destroy(resourceName, homedir);
  });

  test(`Zip file exists within ${stagingPath}/${resourceName}`, async () => {
    const zipFile = await exists(`${stagingPath}/${postLambdaName}/${postLambdaName}.zip`);
    expect(zipFile).toBe(true);
  });

  test('Lambda exists on AWS', async () => {
    const functionExists = await doesLambdaExist(postLambdaName);
    expect(functionExists).toBe(true);
  });
});

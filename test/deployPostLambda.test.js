const os = require('os');

const deployEC2 = require('../src/aws/deployEC2');
const deployPostLambda = require('../src/aws/deployPostLambda');
const deploySecurityGroup = require('../src/aws/deploySecurityGroup');
const deployDLQ = require('../src/aws/deployDLQ');
const deploySQS = require('../src/aws/deploySQS');
const { doesLambdaExist } = require('../src/aws/doesResourceExist');
const destroy = require('../src/commands/destroy');
const { asyncInvokeLambda, asyncSendMessage, asyncGetQueueAttributes } = require('../src/aws/awsFunctions');
const sleep = require('../src/util/sleep');
const terminateEC2Instance = require('../src/aws/terminateEC2Instance');

const {
  getStagingPath,
  exists,
} = require('../src/util/fileUtils');

const resourceName = 'testNami8000';
const postLambdaName = `${resourceName}PostLambda`;
const homedir = os.homedir();
const stagingPath = getStagingPath(homedir);

// don't forget to deploy Q!
describe('Nami deploy Post Lambda', () => {
  let instanceId;
  let securityGroupId;
  let queueUrl;
  let queueUrlDLQ;

  jest.setTimeout(300000);
  beforeAll(async () => {
    jest.setTimeout(300000);
    queueUrlDLQ = await deployDLQ(resourceName);
    queueUrl = await deploySQS(resourceName, homedir);
    securityGroupId = await deploySecurityGroup(resourceName, 'lambda');
    await sleep(65000);
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

  test('Test connection to database', async () => {
    const asyncInvokeLambdaParams = {
      FunctionName: `${postLambdaName}`,
    };
    const data = await asyncInvokeLambda(asyncInvokeLambdaParams);
    expect(data.StatusCode).toBe(200);
  });

  test('Test retried messages go into DLQ', async () => {
    const asyncSendMessageParams = {
      MessageBody: JSON.stringify({}),
      QueueUrl: queueUrl,
    };
    const getQueueAttributesParams = {
      QueueUrl: queueUrlDLQ,
      AttributeNames: [
        'ApproximateNumberOfMessages',
      ],
    };
    await terminateEC2Instance(resourceName);
    await asyncSendMessage(asyncSendMessageParams);
    await sleep(200000);
    const queueInformation = await asyncGetQueueAttributes(getQueueAttributesParams);
    const numberOfMessages = queueInformation.Attributes.ApproximateNumberOfMessages;
    expect(numberOfMessages).toBe('1');
  });
});

/**
 * @jest-environment node
 */

const os = require('os');
const axios = require('axios');

const sleep = require('../src/util/sleep');
const deployApi = require('../src/aws/deployApi');
const deployPreLambda = require('../src/aws/deployPreLambda');
const deployDLQ = require('../src/aws/deployDLQ');
const deploySQS = require('../src/aws/deploySQS');
const { doesLambdaExist } = require('../src/aws/doesResourceExist');
const destroy = require('../src/commands/destroy');
const { asyncGetQueueAttributes } = require('../src/aws/awsFunctions');
const getRegion = require('../src/util/getRegion');
const {
  getStagingPath,
  exists,
  readConfig,
} = require('../src/util/fileUtils');


const region = getRegion();
const resourceName = 'testNami2';
const preLambdaName = `${resourceName}PreLambda`;
const sqsName = `${resourceName}SQS`;
const homedir = os.homedir();
const stageName = 'nami';
const httpMethods = ['POST'];
const stagingPath = getStagingPath(homedir);
const eventObject = { body: 'webhook test message' };

describe('nami deploy pre-queue lambda', () => {
  beforeEach(async () => {
    jest.setTimeout(120000);
  });

  afterEach(async () => {
    await destroy(resourceName, homedir);
  });

  test(`Zip file exists within ${stagingPath}/${resourceName}`, async () => {
    await deployPreLambda(resourceName, homedir);
    const zipFile = await exists(`${stagingPath}/${preLambdaName}/${preLambdaName}.zip`);

    expect(zipFile).toBe(true);
  });

  test('Function exists on AWS', async () => {
    await deployPreLambda(resourceName, homedir);
    const functionExists = await doesLambdaExist(preLambdaName);

    expect(functionExists).toBe(true);
  });

  test('Function can send message to SQS', async () => {
    const { accountNumber } = await readConfig(homedir);
    const QueueUrl = `https://sqs.${region}.amazonaws.com/${accountNumber}/${sqsName}`;

    await deployPreLambda(resourceName, homedir);
    const { endpoint } = await deployApi(resourceName, homedir, httpMethods, stageName);
    await sleep(65000);
    await deployDLQ(resourceName);
    await deploySQS(resourceName, homedir);

    try {
      await axios.post(endpoint, eventObject);
    } catch (err) {
      console.log(err);
    }

    const getQueueAttributesParams = {
      QueueUrl,
      AttributeNames: [
        'ApproximateNumberOfMessages',
      ],
    };

    const queueInformation = await asyncGetQueueAttributes(getQueueAttributesParams);
    const numberOfMessages = queueInformation.Attributes.ApproximateNumberOfMessages;
    expect(numberOfMessages).toBe('1');
  });
});

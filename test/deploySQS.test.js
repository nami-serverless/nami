const os = require('os');
const axios = require('axios');
const deploySQS = require('../src/aws/deploySQS');
const deployDLQ = require('../src/aws/deployDLQ');
const destroy = require('../src/commands/destroy');
const deployApi = require('../src/aws/deployApi');
const deployPreLambda = require('../src/aws/deployPreLambda');
const sleep = require('../src/util/sleep');
const {
  asyncGetQueueAttributes,
  asyncReceiveMessage,
} = require('../src/aws/awsFunctions');
const { doesQueueExist } = require('../src/aws/doesResourceExist');

const stageName = 'nami';
const httpMethods = ['POST'];
const eventObject = { body: 'webhook test message' };

const homedir = os.homedir();

const namiErr = require('./../src/util/errorLogger');

describe('nami deploy SQS', () => {
  const resourceName = 'testing2';
  const queueType = 'SQS';
  let QueueUrl;

  beforeEach(async () => {
    jest.setTimeout(70000);
  });

  beforeAll(async () => {
    jest.setTimeout(70000);
    await sleep(65000);
    await deployDLQ(resourceName);
    QueueUrl = await deploySQS(resourceName, homedir);
  });

  afterAll(async () => {
    await destroy(resourceName, homedir);
  });

  test('SQS exists on AWS', async () => {
    const sqsStatus = await doesQueueExist(resourceName, queueType);
    expect(sqsStatus).toBe(true);
  });

  test('SQS have Redrive policy', async () => {
    const getQueueAttributesParams = {
      QueueUrl,
      AttributeNames: [
        'RedrivePolicy',
      ],
    };

    const data = await asyncGetQueueAttributes(getQueueAttributesParams);
    const redrive = !!(Object.keys(data.Attributes).includes('RedrivePolicy'));
    expect(redrive).toBe(true);
  });

  test('SQS contains event object', async () => {
    await deployPreLambda(resourceName, homedir);
    const { endpoint } = await deployApi(resourceName, homedir, httpMethods, stageName);

    try {
      await axios.post(endpoint, eventObject);
    } catch (err) {
      namiErr(err);
    }

    const messages = await asyncReceiveMessage({ QueueUrl, MaxNumberOfMessages: 1 });
    const messageBody = messages.Messages[0].Body;
    const messageContainsPayload = RegExp('webhook test message').test(messageBody);

    expect(messageContainsPayload).toBe(true);
  });
});

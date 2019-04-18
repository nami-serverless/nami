const os = require('os');
const deployDLQ = require('../src/aws/deployDLQ');
const deleteDLQ = require('../src/aws/deleteDLQ');
const { doesQueueExist } = require('../src/aws/doesResourceExist');

const homedir = os.homedir();

describe('nami deploy DLQ', () => {
  let dlqStatus;
  const queueType = 'DLQ';
  const resourceName = 'testing';

  afterEach(async () => {
    await deleteDLQ(resourceName, homedir);
  });

  test('DLQ exists on AWS', async () => {
    await deployDLQ(resourceName);
    dlqStatus = await doesQueueExist(resourceName, queueType);
    expect(dlqStatus).toBe(true);
  });
});

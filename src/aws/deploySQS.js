const getRegion = require('../util/getRegion');
const { readConfig } = require('../util/fileUtils');
const { asyncCreateSQS } = require('./awsFunctions');
const namiLog = require('./../util/logger');

const region = getRegion();

module.exports = async function deploySQS(resourceName, homedir) {
  const { accountNumber } = await readConfig(homedir);

  const queueName = `${resourceName}SQS`;
  const dlqArn = `arn:aws:sqs:${region}:${accountNumber}:${resourceName}DLQ`;

  const redrivePolicy = JSON.stringify({
    deadLetterTargetArn: dlqArn,
    maxReceiveCount: 5,
  });

  const params = {
    QueueName: queueName,
    Attributes: {
      RedrivePolicy: redrivePolicy,
    },
  };

  const queue = await asyncCreateSQS(params);
  namiLog(`${queueName} deployed`);
  return queue.QueueUrl;
};

const { promisify } = require('util');
const AWS = require('aws-sdk');

const apiVersion = 'latest';
const region = 'userRegion';
const sqs = new AWS.SQS({ region, apiVersion });

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'nami rocks!',
      input: event,
    }),
  };

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: 'queueURL',
  };

  await promisify(sqs.sendMessage.bind(sqs))(params);

  return response;
};

const { promisify } = require('util');
const AWS = require('aws-sdk');

const apiVersion = 'latest';

// Please do not modify the below line. 'userRegion' will be replaced
// with your actual region when deploying.
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

  // Please do not modify the params object. 'queueURL' will be replaced
  // with the actual URL for the queue when deploying
  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: 'queueURL',
  };

  await promisify(sqs.sendMessage.bind(sqs))(params);

  return response;
};

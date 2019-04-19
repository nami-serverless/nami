const { promisify } = require('util');
const AWS = require('aws-sdk');

const apiVersion = 'latest';

const region = 'userRegion'; // Please do not modify this line.

const sqs = new AWS.SQS({ region, apiVersion });

exports.handler = async (event) => {
  const response = { statusCode: 200 };

  /*

  Please make sure to handle Authentication you wish to use

  */

  // Please do not modify the params object.
  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: 'queueURL',
  };

  await promisify(sqs.sendMessage.bind(sqs))(params);

  return response;
};

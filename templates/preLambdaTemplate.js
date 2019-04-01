'use strict';
const AWS = require('aws-sdk');
const { promisify } = require('util');
const apiVersion = 'latest';
const region = 'userRegion';
const sqs = new AWS.SQS({ region, apiVersion });

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'nami rocks!',
      input: event,
    }),
  };

  var params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: 'queueURL',
  };

  await promisify(sqs.sendMessage.bind(sqs))(params);

  return response;
};

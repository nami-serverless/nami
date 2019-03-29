const { promisify } = require('util');
const AWS = require('aws-sdk')
const apiVersion = 'latest';
const region = 'us-east-1';
const lambda = new AWS.Lambda({ apiVersion, region });

const asyncLambdaCreateFunction = promisify(lambda.createFunction.bind(lambda));

module.exports = {
  asyncLambdaCreateFunction,
}

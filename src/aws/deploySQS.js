const AWS = require('aws-sdk');
const { getRegion } = require('../util/getRegion');
const { asyncCreateSQS } = require('./awsFunctions');
const region = getRegion();
const apiVersion = 'latest';

const sqs = new AWS.SQS({ region, apiVersion});

module.exports = async function deploySQS() {
	const params = {
		QueueName: 'namiSQS',
		MessageRetentionPeriod: 1209600,
	};

	const queue = await asyncCreateSQS(params);

	return queue.QueueUrl;
};

const AWS = require('aws-sdk');
const { getRegion } = require('../util/getRegion');
const { asyncCreateSQS } = require('./awsFunctions');
const region = getRegion();
const apiVersion = 'latest';

const sqs = new AWS.SQS({ region, apiVersion});

module.exports = async function deploySQS() {
	const params = {
		QueueName: 'namiSQS',
	};

	const queue = await asyncCreateSQS(params);
	console.log("SQS Queue deployed");
	return queue.QueueUrl;
};

const { getRegion } = require('../util/getRegion');
const { asyncCreateSQS } = require('./awsFunctions');
const namiLog = require('./../util/logger');

module.exports = async function deploySQS(resourceName) {
	const params = {
		QueueName: `${resourceName}SQS`,
	};

	const queue = await asyncCreateSQS(params);
	namiLog('SQS Queue deployed');
	return queue.QueueUrl;
};

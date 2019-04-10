const { asyncCreateSQS } = require('./awsFunctions');
const namiLog = require('./../util/logger');

module.exports = async function deployDLQ(resourceName) {
	const params = {
		QueueName: `${resourceName}DLQ`,
    Attributes: {
      'MessageRetentionPeriod': '1209600',
    }
	};

	const queue = await asyncCreateSQS(params);
  namiLog(`${resourceName}DLQ deployed`);
};

const { asyncStopInstances } = require('./awsFunctions');
const getInstanceId = require('./../util/getInstanceId');

module.exports = async function stopEC2Instance(resourceName) {
	const instanceId = getInstanceId(resourceName);

	const params = {
		InstanceIds: `${instanceId}`,
	};

	return await asyncStopInstances(params);
};
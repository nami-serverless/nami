const { asyncDeleteQueue } = require('./awsFunctions');
const getRegion = require('../util/getRegion');
const { readConfig } = require('../util/fileUtils');
const namiLog = require('../util/logger');
const namiErr = require('../util/errorLogger');

module.exports = async function deleteSQS(resourceName, homedir) {
  const { accountNumber } = await readConfig(homedir);
  const region = getRegion();
  const QueueUrl = `https://sqs.${region}.amazonaws.com/${accountNumber}/${resourceName}SQS`;

  const deleteQueueParams = {
    QueueUrl,
  };

  try {
    await asyncDeleteQueue(deleteQueueParams);
    namiLog('SQS deleted');
  } catch (err) {
    namiErr('Delete Queue Error =>', err.message);
  }
};

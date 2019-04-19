const { asyncDeleteQueue } = require('./awsFunctions');
const getRegion = require('../util/getRegion');
const { readConfig } = require('../util/fileUtils');
const namiLog = require('../util/logger');
const namiErr = require('../util/logger');

module.exports = async function deleteDLQ(resourceName, homedir) {
  const { accountNumber } = await readConfig(homedir);
  const region = getRegion();
  const QueueUrl = `https://sqs.${region}.amazonaws.com/${accountNumber}/${resourceName}DLQ`;

  const deleteQueueParams = {
    QueueUrl,
  };

  try {
    await asyncDeleteQueue(deleteQueueParams);
    namiLog('DLQ deleted');
  } catch (err) {
    namiErr('DLQ delete Error =>', err.message);
  }
};

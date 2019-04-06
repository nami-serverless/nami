const { asyncDeleteQueue } = require('./awsFunctions');
const { getRegion } = require('../util/getRegion');
const { readConfig } = require('../util/fileUtils');

module.exports = async function deleteSQS(resourceName, homedir) {
  const { accountNumber } = await readConfig(homedir);
  const region = getRegion();
  const QueueUrl = `https://sqs.${region}.amazonaws.com/${accountNumber}/${resourceName}SQS`;

  const deleteQueueParams = {
    QueueUrl,
  };

  try {
    await asyncDeleteQueue(deleteQueueParams);
  } catch (err) {
    console.log('Delete Queue Error =>', err.message);
  }
};

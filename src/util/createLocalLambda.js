const fs = require('fs');
const AWS = require('aws-sdk');
const os = require('os');
const { getRegion } = require('../util/getRegion');
const region = getRegion();

const apiVersion = 'latest';
const { readConfig, getNamiPath } = require('./fileUtils');
const homedir = os.homedir();

const { writeTemplateToStage } = require('./fileUtils');

const {
  readFile,
  writeFile,
  copyFile,
  mkdir,
} = require('./fileUtils');

const { getEC2PrivateIp } = require('./getEC2PrivateIp');

const getTemplate = async (resourceName, templateType, instanceId) => {
	const { accountNumber } = await readConfig(homedir);

  const queueURL = `https://sqs.${region}.amazonaws.com/${accountNumber}/${resourceName}SQS`;
  const lambdaTemplateLocation = `${__dirname}/../../templates/${templateType}Template.js`;
  const lambdaTemplate = await readFile(lambdaTemplateLocation, 'utf8');
  const lambdaTemplateWithRegion = lambdaTemplate.replace('userRegion', region);
  const lambdaTemplateWithQueueURL = lambdaTemplateWithRegion.replace('queueURL', queueURL);

  if (templateType === 'postLambda') {
    const privateIp = await getEC2PrivateIp(instanceId);
    return lambdaTemplateWithQueueURL.replace('privateIp', privateIp);
  }

  return lambdaTemplateWithQueueURL;
};

module.exports = async function createLocalLambda(resourceName, lambdaName, templateType, instanceId) {
  const template = await getTemplate(resourceName, templateType, instanceId);

  await writeTemplateToStage(lambdaName, template, homedir);
};

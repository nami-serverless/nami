const fs = require('fs');
const AWS = require('aws-sdk');
const os = require('os');
const { getRegion } = require('../util/getRegion');
const region = getRegion();

const apiVersion = 'latest';
const { readConfig, getNamiPath } = require('./fileUtils');
const homedir = os.homedir();

const {
  readFile,
  writeFile,
  copyFile,
  mkdir,
} = require('./fileUtils');

const { getEC2PrivateIp } = require('./getEC2PrivateIp');

// const {
  // namiLog,
  // msgAfterAction,
// } = require('../util/logger');

const getTemplate = async (templateType, instanceId) => {
	const { accountNumber } = await readConfig(homedir);
  const queueURL = `https://sqs.${region}.amazonaws.com/${accountNumber}/namiSQS`;
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

const writeTemplateLocally = async (templateType, template) => {
  const dirName = templateType;
  await mkdir(`${getNamiPath(homedir)}/staging/${dirName}`);
  await writeFile(`${getNamiPath(homedir)}/staging/${dirName}/${templateType}.js`, template);
};

module.exports = async function createLocalLambda(templateType, instanceId) {
  const template = await getTemplate(templateType, instanceId);
  await writeTemplateLocally(templateType, template);
  // const resource = 'file';
  // const name = `${lambdaName}.js`;
  // namiLog(msgAfterAction(resource, name, 'created'));
};

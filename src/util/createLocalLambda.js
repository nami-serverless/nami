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

// const {
  // namiLog,
  // msgAfterAction,
// } = require('../util/logger');

const getTemplate = async (templateType) => {
	const { accountNumber } = await readConfig(homedir);
  const queueURL = `https://sqs.${region}.amazonaws.com/${accountNumber}/namiSQS`;
  const lambdaTemplateLocation = `${__dirname}/../../templates/${templateType}Template.js`;
  const lambdaTemplate = await readFile(lambdaTemplateLocation, 'utf8');
  const lambdaTemplateWithRegion = lambdaTemplate.replace('userRegion', region);
  const lambdaTemplateWithQueueURL = lambdaTemplateWithRegion.replace('queueURL', queueURL);
  return lambdaTemplateWithQueueURL;
};

const writeTemplateLocally = async (resourceName, preLambda, template) => {
  const dirName = preLambda ? 'preLambda' : 'postLambda';
  await mkdir(`${getNamiPath(homedir)}/staging/${dirName}`);
  await writeFile(`${getNamiPath(homedir)}/staging/${dirName}/${resourceName}.js`, template);
};

module.exports = async function createLocalLambda(resourceName) {
  let templateType = 'preLambda'; // fix hardcoding

  const template = await getTemplate(templateType);
  await writeTemplateLocally(resourceName, true, template);
  // const resource = 'file';
  // const name = `${lambdaName}.js`;
  // namiLog(msgAfterAction(resource, name, 'created'));
};

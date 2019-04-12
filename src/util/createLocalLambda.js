const os = require('os');
const getRegion = require('../util/getRegion');

const region = getRegion();
const homedir = os.homedir();

const {
  readConfig,
  readFile,
  exists,
  writeTemplateToStage,
} = require('./fileUtils');

const { getEC2PrivateIp } = require('./getEC2PrivateIp');

const getTemplate = async (templateType, isCustomTemplate, resourceName) => {
  let lambdaTemplateLocation;

  if (isCustomTemplate) {
    const type = `${templateType.slice(0, 1).toUpperCase().concat(templateType.slice(1))}`;
    lambdaTemplateLocation = `${process.cwd()}/${resourceName}${type}/${resourceName}${type}.js`;
  } else {
    lambdaTemplateLocation = `${__dirname}/../../templates/${templateType}Template.js`;
  }

  const lambdaTemplate = await readFile(lambdaTemplateLocation, 'utf8');
  return lambdaTemplate;
};

const replaceStringPreLambda = async (template, resourceName) => {
  const { accountNumber } = await readConfig(homedir);
  const queueURL = `https://sqs.${region}.amazonaws.com/${accountNumber}/${resourceName}SQS`;
  const lambdaTemplateWithRegion = template.replace('userRegion', region);
  const lambdaTemplateWithQueueURL = lambdaTemplateWithRegion.replace('queueURL', queueURL);
  return lambdaTemplateWithQueueURL;
};

const replacePrivateIPPostLambda = async (template, instanceId) => {
  const privateIp = await getEC2PrivateIp(instanceId);
  return template.replace('privateIp', privateIp);
};

const createLocalLambda = async (resourceName, lambdaName, templateType, instanceId) => {
  const type = templateType.slice(0, 1).toUpperCase().concat(templateType.slice(1));
  const path = `${process.cwd()}/${resourceName}${type}`;
  const isCustomTemplate = await exists(path);
  let updatedTemplate;

  const template = await getTemplate(templateType, isCustomTemplate, resourceName);

  if (templateType === 'preLambda') {
    updatedTemplate = await replaceStringPreLambda(template, resourceName);
  } else if (templateType === 'postLambda') {
    updatedTemplate = await replacePrivateIPPostLambda(template, instanceId);
  }

  await writeTemplateToStage(lambdaName, updatedTemplate, homedir);
};

module.exports = {
  createLocalLambda,
  getTemplate,
};

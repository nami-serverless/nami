const { writeTemplateLocally } = require('./../util/fileUtils');
const { getTemplate } = require('./../util/createLocalLambda');
const namiLog = require('./../util/logger');

module.exports = async function create(resourceName, homedir) {
  let preLambdaName = `${resourceName}PreLambda`;
  let postLambdaName = `${resourceName}PostLambda`;

  let preLambdaTemplate = await getTemplate('preLambda', false, resourceName);
  let postLambdaTemplate = await getTemplate('postLambda', false, resourceName);

  await writeTemplateLocally(preLambdaName, preLambdaTemplate);
  await writeTemplateLocally(postLambdaName, postLambdaTemplate);
  namiLog(`Your lambda templates, ${preLambdaName} and ${postLambdaName} are in ${process.cwd()}`);
  namiLog('Please make any modifications to them before calling deploy');
};

const { writeTemplateLocally, exists } = require('./../util/fileUtils');
const { getTemplate } = require('./../util/createLocalLambda');
const namiLog = require('./../util/logger');

module.exports = async function create(resourceName) {
  const preLambdaName = `${resourceName}PreLambda`;
  const postLambdaName = `${resourceName}PostLambda`;

  const preLambdaTemplate = await getTemplate('preLambda', false, resourceName);
  const postLambdaTemplate = await getTemplate('postLambda', false, resourceName);

  const preLambdaDirectoryExists = await exists(`${process.cwd()}/${preLambdaName}`);
  const postLambdaDirectoryExists = await exists(`${process.cwd()}/${postLambdaName}`);

  if (!preLambdaDirectoryExists) {
    await writeTemplateLocally(preLambdaName, preLambdaTemplate);
    namiLog(`Your lambda template ${preLambdaName} is in ${process.cwd()}`);
  } else {
    namiLog(`Directory ${preLambdaName} already exists`);
  }

  if (!postLambdaDirectoryExists) {
    await writeTemplateLocally(postLambdaName, postLambdaTemplate);
    namiLog(`Your lambda template ${postLambdaName} is in ${process.cwd()}`);
  } else {
    namiLog(`Directory ${postLambdaName} already exists`);
  }

  namiLog('Please make any modifications to your handler files before calling deploy');
};

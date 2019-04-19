const setupNamiDirAndFiles = require('./setupNamiDirAndFiles');
const { createPreLambdaRole, createPostLambdaRole } = require('../aws/createRoles');
const { doesRoleExist } = require('../aws/doesResourceExist');
const sleep = require('./sleep');
const namiLog = require('../util/logger');

module.exports = async function init(homedir) {
  await setupNamiDirAndFiles(homedir);

  const preLambdaRoleName = 'namiPreLambda';
  const postLambdaRoleName = 'namiPostLambda';
  const doesPreRoleNameExist = await doesRoleExist(preLambdaRoleName);
  const doesPostRoleNameExist = await doesRoleExist(postLambdaRoleName);

  if (!doesPreRoleNameExist) {
    await createPreLambdaRole(preLambdaRoleName);
    namiLog('Initializing first lambda role.');
    await sleep(2500);
  }

  if (!doesPostRoleNameExist) {
    await createPostLambdaRole(postLambdaRoleName);
    namiLog('Initializing second lambda role.');
    await sleep(2500);
  }

  return true;
};

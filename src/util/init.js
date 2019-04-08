const setupNamiDirAndFiles = require('./setupNamiDirAndFiles');
const { createPreLambdaRole, createPostLambdaRole } = require('../aws/createRoles');
const { doesRoleExist } = require('./../aws/doesResourceExist');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  });
}

module.exports = async function init(roleName, homedir) {
  await setupNamiDirAndFiles(roleName, homedir);

  const preLambdaRoleName = 'namiPreLambda';
  const postLambdaRoleName = 'namiPostLambda';
  const doesPreRoleNameExist = await doesRoleExist(preLambdaRoleName);
  const doesPostRoleNameExist = await doesRoleExist(postLambdaRoleName);

  if (!doesPreRoleNameExist) {
    await createPreLambdaRole(preLambdaRoleName);
    console.log('Initializing first lambda role.');
  }

  if (!doesPostRoleNameExist) {
    await createPostLambdaRole(postLambdaRoleName);
    console.log('Initializing second lambda role.');
  }

  return true;
};

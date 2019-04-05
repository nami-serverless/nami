const setupNamiDirAndFiles = require('./setupNamiDirAndFiles');
const { createPreLambdaRole, createPostLambdaRole } = require('../aws/createRoles');
const { doesRoleExist } = require('./../aws/doesResourceExist');

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  });
}

module.exports = async function init(roleName, homedir) {
  await setupNamiDirAndFiles(roleName, homedir);
  const preLambdaRoleName = 'namiPreLambda';
  const postLambdaRoleName = 'namiPostLambda'
  const doesPreRoleNameExist = await doesRoleExist(preLambdaRoleName);
  const doesPostRoleNameExist = await doesRoleExist(postLambdaRoleName);

  if (!doesPreRoleNameExist) {
  	await createPreLambdaRole(preLambdaRoleName);
  	console.log('initializing first lambda role.');
  	await sleep(2500);
  }

  if (!doesPostRoleNameExist) {
  	await createPostLambdaRole(postLambdaRoleName);
  	console.log('initializing second lambda role.');
  	await sleep(2500);
  }

  return true;
};

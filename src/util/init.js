const setupNamiDirAndFiles = require('./setupNamiDirAndFiles');
const { createPreLambdaRole, createPostLambdaRole } = require('../aws/createRoles');


module.exports = async function init(roleName, path) {
  //await setupNamiDirAndFiles(roleName, path);
  await createPreLambdaRole();
  await createPostLambdaRole();

  return true;
};

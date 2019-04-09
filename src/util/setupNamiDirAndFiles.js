const { asyncGetCallerIdentity } = require('../aws/awsFunctions');

const {
  createDirectory,
  createJSONFile,
  getNamiPath,
  copyEC2SetupScript,
} = require('./fileUtils');

module.exports = async function setupNamiDirAndFiles(roleName, homePath) {
  const accountNumber = (await asyncGetCallerIdentity()).Account;
  const configJSON = {
    accountNumber,
    role: roleName,
  };

  const resourcesJSON = {
    restApiId: '',
  };

  const namiPath = await getNamiPath(homePath);
  const scriptLocation = `${__dirname}/../../templates`;
  try {
    await createDirectory('.nami', homePath);
    await createDirectory('staging', namiPath);
    await createJSONFile('config', namiPath, configJSON);
    await createJSONFile('resources', namiPath, resourcesJSON);
    await copyEC2SetupScript(namiPath, scriptLocation);
    // need config file for SQS?
  } catch (err) {
    console.log('Error setting up framework directory and files => ', err.message);
  }
};

const { asyncGetCallerIdentity, asyncGetRegions } = require('../aws/awsFunctions');

const {
  createDirectory,
  createJSONFile,
  getNamiPath,
  copyEC2SetupScript,
} = require('./fileUtils');

// fix hard coding by using asyncGetRegions
const regions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2',
  'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
  'ap-southeast-1', 'ap-southeast-2', 'ap-south-1', 'sa-east-1'];

const startingTemplate = regions.reduce((acc, region) => {
  acc[region] = {};
  return acc;
}, {});

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
    await createJSONFile('lambdas', namiPath, startingTemplate);
    await createJSONFile('apis', namiPath, startingTemplate);
    await createJSONFile('dbTables', namiPath, startingTemplate);
    await copyEC2SetupScript(scriptLocation);
    // need config file for SQS?
  } catch (err) {
    console.log('Error setting up framework directory and files => ', err.message);
  }
};

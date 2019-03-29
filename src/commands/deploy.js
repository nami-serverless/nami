// const deployPreLambda = require('../aws/deployPreLambda');
// const deployPostLambda = require('../aws/deployPostLambda');
// const deployApi = require('../aws/deployApi');
// const deploySQS = require('../aws/deploySQS');
// const deployEC2 = require('../aws/deployEC2');
// const setupMongo = require('../aws/setupMongo');

// const {
//   functionName,
// } = require('../testvariables');

const httpsMethods = ['POST'];
const config = {
  "accountNumber": "",
  "role": "namiRole"
};

const httpMethods = ['POST'];
const stageName = 'nami';

module.exports = async function deploy(resourceName, options, path) {
  try {
    // await deployPreLambda(functionName);
    // await deployApi(resourceName, config, httpMethods, stageName);
    // await deploySQS();
    // await deployPostLambda();
    // await deployEC2();
    // await setupMongo();
  } catch (err) {
    console.log(err);
  }
};

const deployPreLambda = require('../aws/deployPreLambda');
// const deployPostLambda = require('../aws/deployPostLambda');
const deployApi = require('../aws/deployApi');
const deploySQS = require('../aws/deploySQS');
// const deployEC2 = require('../aws/deployEC2');
// const setupMongo = require('../aws/setupMongo');
const createLocalLambda = require('./../util/createLocalLambda');

const httpMethods = ['POST'];
const stageName = 'nami';

module.exports = async function deploy(resourceName, options, homedir) {
  try {
  	await createLocalLambda(resourceName);
    // await deployPreLambda('preLambda', homedir);
    // await deployApi(resourceName, homedir, httpMethods, stageName);
    // await deploySQS();
    // await deployPostLambda();
    // await deployEC2(homedir);
    // await setupMongo();
  } catch (err) {
    console.log(err);
  }
};

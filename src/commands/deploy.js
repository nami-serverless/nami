const deployPreLambda = require('../aws/deployPreLambda');
const deployPostLambda = require('../aws/deployPostLambda');
const deployApi = require('../aws/deployApi');
const deploySQS = require('../aws/deploySQS');
const deployEC2 = require('../aws/deployEC2');

const httpMethods = ['POST'];
const stageName = 'nami';

module.exports = async function deploy(resourceName, options, homedir) {
  try {

    const instanceId = await deployEC2(resourceName, homedir);
    await deployPreLambda(resourceName, homedir);
    await deployApi(resourceName, homedir, httpMethods, stageName);
    await deploySQS(resourceName);
    await deployPostLambda(resourceName, homedir, instanceId);
  } catch (err) {
    console.log(err);
  }
};

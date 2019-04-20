const deployPreLambda = require('../aws/deployPreLambda');
const deployPostLambda = require('../aws/deployPostLambda');
const deployApi = require('../aws/deployApi');
const deployDLQ = require('../aws/deployDLQ');
const deploySQS = require('../aws/deploySQS');
const deployEC2 = require('../aws/deployEC2');
const namiLog = require('../util/logger');
const namiErr = require('../util/errorLogger');
const deploySecurityGroup = require('../aws/deploySecurityGroup');
const destroy = require('./destroy');

const httpMethods = ['POST'];
const stageName = 'nami';
const securityGroupType = 'lambda';

module.exports = async function deploy(resourceName, homedir) {
  try {
    namiLog('Starting deployment sequence');
    const SecurityGroupId = await deploySecurityGroup(resourceName, securityGroupType);
    const instanceId = await deployEC2(resourceName, homedir);
    await deployPreLambda(resourceName, homedir);
    const { endpoint } = await deployApi(resourceName, homedir, httpMethods, stageName);
    await deployDLQ(resourceName);
    await deploySQS(resourceName, homedir);
    await deployPostLambda(resourceName, homedir, instanceId, SecurityGroupId);
    namiLog('Deployment sequence complete\n');
    namiLog(`Your Nami endpoint is: \n\x1b[1m${endpoint}\x1b[0m`);
  } catch (err) {
    namiErr(`Deployment error => ${err.message}`);
    namiLog('Rolling back...');
    await destroy(resourceName, homedir);
    namiLog('Roll back complete');
  }
};

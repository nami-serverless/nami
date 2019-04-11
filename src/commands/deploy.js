const deployPreLambda = require('../aws/deployPreLambda');
const deployPostLambda = require('../aws/deployPostLambda');
const deployApi = require('../aws/deployApi');
const deployDLQ = require('../aws/deployDLQ');
const deploySQS = require('../aws/deploySQS');
const deployEC2 = require('../aws/deployEC2');
const namiLog = require('./../util/logger');
const deploySecurityGroup = require('./../aws/deploySecurityGroup');

const httpMethods = ['POST'];
const stageName = 'nami';

module.exports = async function deploy(resourceName, options, homedir) {
  try {
    const SecurityGroupId = await deploySecurityGroup(resourceName, 'lambda');
    const instanceId = await deployEC2(resourceName, homedir);
    await deployPreLambda(resourceName, homedir);
    await deployApi(resourceName, homedir, httpMethods, stageName);
    await deployDLQ(resourceName);
    await deploySQS(resourceName, homedir);
    await deployPostLambda(resourceName, homedir, instanceId, SecurityGroupId);
  } catch (err) {
    namiLog(err);
  }
};

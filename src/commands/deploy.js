const deployPreLambda = require('../aws/deployPreLambda');
const deployPostLambda = require('../aws/deployPostLambda');
const deployApi = require('../aws/deployApi');
const deploySQS = require('../aws/deploySQS');
const deployEC2 = require('../aws/deployEC2');
const getDefaultVpcId = require('./../util/getDefaultVpcId');
const createSecurityGroup = require('./../util/createSecurityGroup');


const httpMethods = ['POST'];
const stageName = 'nami';

module.exports = async function deploy(resourceName, options, homedir) {
  try {
    const defaultVpcID = await getDefaultVpcId();

    const description = 'Security Group for Post Queue Lambda in Nami Framework';
    const groupName = `${resourceName}PostLambdaSecurityGroup`;
    const SecurityGroupId = await createSecurityGroup(description, groupName, defaultVpcID);
    console.log(SecurityGroupId);

    const instanceId = await deployEC2(resourceName, homedir);
    await deployPreLambda(resourceName, homedir);
    await deployApi(resourceName, homedir, httpMethods, stageName);
    await deploySQS(resourceName);
    await deployPostLambda(resourceName, homedir, instanceId, SecurityGroupId);
  } catch (err) {
    console.log(err);
  }
};

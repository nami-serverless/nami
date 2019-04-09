const { promisify } = require('util');
const fs = require('fs');
const { readConfig, getNamiPath } = require('../util/fileUtils');

const { zipper } = require('../util/zipper');
const { getRegion } = require('../util/getRegion');
const createLocalLambda = require('./../util/createLocalLambda');
const installLambdaDependencies = require('./../util/installLambdaDependencies');

const describeSubnets = require('./../util/describeSubnets');
const getDefaultVpcId = require('./../util/getDefaultVpcId');

const readFile = promisify(fs.readFile);
const namiLog = require('./../util/logger');

const {
  asyncLambdaCreateFunction,
  asyncCreateEventSourceMapping,
  asyncPutFunctionConcurrency,
} = require('./awsFunctions.js');

const lambdaRoleName = 'namiPostLambda';
const lambdaDesc = 'Writes webhook payload to database.';

module.exports = async function deployPostLambda(resourceName, homedir, instanceId, SecurityGroupId) {
  const { accountNumber } = await readConfig(homedir);
  const lambdaName = `${resourceName}PostLambda`;
  const templateType = 'postLambda';

  await createLocalLambda(resourceName, lambdaName, templateType, instanceId);
  await installLambdaDependencies(lambdaName);
  await zipper(lambdaName, homedir);
  const zipContents = await readFile(`${getNamiPath(homedir)}/staging/${lambdaName}/${lambdaName}.zip`);

  const defaultVpcID = await getDefaultVpcId();

  const subnetIds = await describeSubnets(defaultVpcID);

  try {
    const createFunctionParams = {
      Code: {
        ZipFile: zipContents,
      },
      FunctionName: `${lambdaName}`,
      Handler: `${lambdaName}.handler`,
      Role: `arn:aws:iam::${accountNumber}:role/${lambdaRoleName}`,
      Runtime: 'nodejs8.10',
      Description: `${lambdaDesc}`,
      VpcConfig: {
        SecurityGroupIds: [SecurityGroupId],
        SubnetIds: subnetIds,
      },
    };

    const data = await asyncLambdaCreateFunction(createFunctionParams);

    const putFunctionConcurrencyParams = {
      FunctionName: `${lambdaName}`,
      ReservedConcurrentExecutions: 5,
    };

    await asyncPutFunctionConcurrency(putFunctionConcurrencyParams);

    const region = getRegion();
    const eventSourceMappingParams = {
      EventSourceArn: `arn:aws:sqs:${region}:${accountNumber}:${resourceName}SQS`,
      FunctionName: `${lambdaName}`,
      BatchSize: 1,
    };

    await asyncCreateEventSourceMapping(eventSourceMappingParams);
    namiLog(`${lambdaName} deployed`);
    return data;
  } catch (err) {
    console.log(`Error deploying ${lambdaName} => `, err.message);
  }

  return true;
};

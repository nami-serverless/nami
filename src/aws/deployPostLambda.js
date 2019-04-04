const { promisify } = require('util');
const { readConfig, getNamiPath } = require('../util/fileUtils');
const fs = require('fs');
const AWS = require('aws-sdk');
const { zipper } = require('../util/zipper');
const { getRegion } = require('../util/getRegion');
const createLocalLambda = require('./../util/createLocalLambda');
const installLambdaDependencies = require('./../util/installLambdaDependencies');

const readFile = promisify(fs.readFile);

const {
  asyncLambdaCreateFunction,
  asyncCreateEventSourceMapping,
  asyncPutFunctionConcurrency,
} = require('./awsFunctions.js');

const lambdaRoleName = 'namiPostLambda';
const lambdaDesc = 'post-deploy lambda';

module.exports = async function deployPostLambda(lambdaName, homedir, instanceId) {
  const { accountNumber } = await readConfig(homedir);

  await createLocalLambda(lambdaName, instanceId);
  await installLambdaDependencies(lambdaName);
  const zippedFileName = await zipper(lambdaName, homedir);
  const zipContents = await readFile(`${getNamiPath(homedir)}/staging/postLambda/postLambda.zip`);

  // find SecurityGroupIds and SubnetIds of EC2 instance and pass in as params

//  VpcConfig: {
//    SecurityGroupIds: [
//      'sg-042337d15064ea8fb'
//    ],
//    SubnetIds: [
//      'subnet-0b40aeef19a8653a6',
//      'subnet-0694c4eb638154715',
//    ]
//  }


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
      VpcConfig: {},
    };

    const data = await asyncLambdaCreateFunction(createFunctionParams);

    const putFunctionConcurrencyParams = {
      FunctionName: `${lambdaName}`,
      ReservedConcurrentExecutions: 5,
    };

    await asyncPutFunctionConcurrency(putFunctionConcurrencyParams);

    const region = getRegion();
    // pass in unique resourceName if given at "namiSQS"
    const eventSourceMappingParams = {
      EventSourceArn: `arn:aws:sqs:${region}:${accountNumber}:namiSQS`,
      FunctionName: `${lambdaName}`,
      BatchSize: 1,
    };

    await asyncCreateEventSourceMapping(eventSourceMappingParams);
    console.log("PostLambda deployed");
    return data;
  } catch (err) {
    console.log(err)
  }
};

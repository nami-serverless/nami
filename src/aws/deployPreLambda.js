const { promisify } = require('util');
const { readConfig, getNamiPath } = require('../util/fileUtils');
const fs = require('fs');
const AWS = require('aws-sdk');
const { zipper } = require('../util/zipper');
const createLocalLambda = require('./../util/createLocalLambda');
const installLambdaDependencies = require('./../util/installLambdaDependencies');

const readFile = promisify(fs.readFile);

const {
  asyncLambdaCreateFunction,
} = require('./awsFunctions.js');

//const {
//  functionDir,
//  lambdaName,
//  functionDesc,
//  accountNumber,
//  lambdaRoleName,
//} = require('../testvariables');

const lambdaRoleName = 'bamRole';
const lambdaDesc = 'pre-deploy lambda';

module.exports = async function deployPreLambda(lambdaName, homedir) {
  const { accountNumber } = await readConfig(homedir);

  await createLocalLambda(lambdaName);
  await installLambdaDependencies(lambdaName);
  const zippedFileName = await zipper(lambdaName, homedir);
  const zipContents = await readFile(`${getNamiPath(homedir)}/staging/preLambda/preLambda.zip`);

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
    };

    const data = await asyncLambdaCreateFunction(createFunctionParams);
    console.log("PreLambda deployed");
    return data;
  } catch (err) {
    console.log(err)
  }
};

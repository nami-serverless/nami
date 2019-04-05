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


const lambdaRoleName = 'namiPreLambda';
const lambdaDesc = 'pre-deploy lambda';

module.exports = async function deployPreLambda(resourceName, homedir) {
  const { accountNumber } = await readConfig(homedir);
  const lambdaName = `pre${resourceName}Lambda`;
  const templateType = 'preLambda';

  await createLocalLambda(resourceName, lambdaName, templateType);
  await installLambdaDependencies(lambdaName);
  const zippedFileName = await zipper(lambdaName, homedir);
  const zipContents = await readFile(`${getNamiPath(homedir)}/staging/${lambdaName}/${lambdaName}.zip`);

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
      Tags: {
        'Nami': `${lambdaName}`,
      },
    };

    const data = await asyncLambdaCreateFunction(createFunctionParams);
    console.log(`${lambdaName} deployed`);
    return data;
  } catch (err) {
    console.log(err)
  }
};

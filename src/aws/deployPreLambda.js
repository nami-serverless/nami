const { promisify } = require('util');
const fs = require('fs');
const { readConfig, getNamiPath } = require('../util/fileUtils');
const { zipper } = require('../util/zipper');
const { createLocalLambda } = require('./../util/createLocalLambda');
const installLambdaDependencies = require('./../util/installLambdaDependencies');

const readFile = promisify(fs.readFile);
const namiLog = require('./../util/logger');

const {
  asyncLambdaCreateFunction,
} = require('./awsFunctions.js');


const lambdaRoleName = 'namiPreLambda';
const lambdaDesc = 'Provides immediate response to webhook and pushes message to queue.';

module.exports = async function deployPreLambda(resourceName, homedir) {
  const { accountNumber } = await readConfig(homedir);
  const lambdaName = `${resourceName}PreLambda`;
  const templateType = 'preLambda';

  await createLocalLambda(resourceName, lambdaName, templateType);
  // replace string
  await installLambdaDependencies(lambdaName);
  await zipper(lambdaName, homedir);
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
        Nami: `${lambdaName}`,
      },
    };

    const data = await asyncLambdaCreateFunction(createFunctionParams);
    namiLog(`${lambdaName} deployed`);
    return data;
  } catch (err) {
    console.log(`Error deploying ${lambdaName} => `, err.message);
  }
};

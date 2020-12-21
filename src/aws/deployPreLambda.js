const { promisify } = require('util');
const fs = require('fs');
const { readConfig, getNamiPath } = require('../util/fileUtils');
const { zipper } = require('../util/zipper');
const { createLocalLambda } = require('../util/createLocalLambda');
const installLambdaDependencies = require('../util/installLambdaDependencies');

const readFile = promisify(fs.readFile);
const namiLog = require('../util/logger');

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
  await installLambdaDependencies(lambdaName);
  await zipper(lambdaName, homedir);
  const zipContents = await readFile(`${getNamiPath(homedir)}/staging/${lambdaName}/${lambdaName}.zip`);

  const createFunctionParams = {
    Code: {
      ZipFile: zipContents,
    },
    FunctionName: `${lambdaName}`,
    Handler: `${lambdaName}.handler`,
    MemorySize: 256,
    Role: `arn:aws:iam::${accountNumber}:role/${lambdaRoleName}`,
    Runtime: 'nodejs12.x',
    Description: `${lambdaDesc}`,
    Tags: {
      Nami: `${lambdaName}`,
    },
  };

  const data = await asyncLambdaCreateFunction(createFunctionParams);
  namiLog(`${lambdaName} deployed`);
  return data;
};

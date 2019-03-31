const { promisify } = require('util');
const { readConfig, getNamiPath } = require('../util/fileUtils');
const fs = require('fs');
const AWS = require('aws-sdk');

const readFile = promisify(fs.readFile);

const {
  asyncLambdaCreateFunction,
} = require('./awsFunctions.js');

//const {
//  functionDir,
//  functionName,
//  functionDesc,
//  accountNumber,
//  functionRoleName,
//} = require('../testvariables');

const functionRoleName = 'lambda_basic_execution';
const functionDesc = 'pre-deploy lambda';

module.exports = async function deployPreLambda(functionName, homedir) {
  //const zipContents = await readFile(`./../../staging/${functionDir}/${functionName}.zip`);
  const { accountNumber } = await readConfig(homedir);
  const zipContents = await readFile(`${getNamiPath(homedir)}/staging/preLambda/preLambda.zip`);

  try {
    const createFunctionParams = {
      Code: {
        ZipFile: zipContents,
      },
      FunctionName: `${functionName}`,
      Handler: `${functionName}.handler`,
      Role: `arn:aws:iam::${accountNumber}:role/${functionRoleName}`,
      Runtime: 'nodejs8.10',
      Description: `${functionDesc}`,
    };

    const data = await asyncLambdaCreateFunction(createFunctionParams);
    console.log(data);
    return data;
  } catch (err) {
    console.log(err)
  }
};

// rename files to index.js

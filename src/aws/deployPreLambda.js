const { promisify } = require('util');
const fs = require('fs');
const AWS = require('aws-sdk');

const readFile = promisify(fs.readFile);

const {
  asyncLambdaCreateFunction,
} = require('./awsFunctions.js');

const {
  functionDir,
  functionName,
  functionDesc,
  accountNumber,
  functionRoleName,
} = require('../testvariables');

module.exports = async function deployPreLambda(functionName) {
  //const zipContents = await readFile(`./../../staging/${functionDir}/${functionName}.zip`);
  const zipContents = await readFile('./../../staging/preLambda/preLambda.zip');
  console.log(accountNumber);
  return;
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

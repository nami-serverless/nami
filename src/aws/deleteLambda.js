const { asyncDeleteFunction } = require('./awsFunctions');
const namiLog = require('../util/logger');
const namiErr = require('../util/logger');

module.exports = async function deleteLambda(FunctionName) {
  const deleteFunctionParams = {
    FunctionName,
  };

  try {
    await asyncDeleteFunction(deleteFunctionParams);
    namiLog(`Lambda function ${FunctionName} deleted`);
  } catch (err) {
    namiErr('Delete Function Error => ', err.message);
  }
};

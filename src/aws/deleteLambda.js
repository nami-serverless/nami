const { asyncDeleteFunction } = require('./awsFunctions');
const namiLog = require('../util/logger');

module.exports = async function deleteLambda(FunctionName) {
  const deleteFunctionParams = {
    FunctionName,
  };

  try {
    await asyncDeleteFunction(deleteFunctionParams);
    namiLog(`${FunctionName} deleted`);
  } catch (err) {
    return err.message;
  }
  return true;
};

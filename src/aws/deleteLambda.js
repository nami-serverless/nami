const { asyncDeleteFunction } = require('./awsFunctions');
const namiLog = require('../util/logger');
const namiErr = require('../util/errorLogger');

module.exports = async function deleteLambda(FunctionName) {
  const deleteFunctionParams = {
    FunctionName,
  };

  try {
    await asyncDeleteFunction(deleteFunctionParams);
    namiLog(`${FunctionName} deleted`);
  } catch (err) {
    namiErr(`Delete Function Error => ${err.message}`);
  }
};

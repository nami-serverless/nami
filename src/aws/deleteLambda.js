const { asyncDeleteFunction } = require('./awsFunctions');

module.exports = async function deleteLambda(FunctionName) {
  const deleteFunctionParams = {
    FunctionName,
  };

  try {
    await asyncDeleteFunction(deleteFunctionParams);
    console.log(`Lambda function ${FunctionName} deleted`);
  } catch (err) {
    console.log('Delete Function Error => ', err.message);
  }
};

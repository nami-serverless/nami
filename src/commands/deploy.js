const deployPreLambda = require('../aws/deployPreLambda');
// const deployPostLambda = require('../aws/deployPostLambda');
// const deployApi = require('../aws/deployApi');
// const deploySQS = require('../aws/deploySQS');
// const deployEC2 = require('../aws/deployEC2');
// const setupMongo = require('../aws/setupMongo');


module.exports = async function deploy(resourceName, options) {
  try {
    await deployPreLambda();
    // await deployApi();
    // await deploySQS();
    // await deployPostLambda();
    // await deployEC2();
    // await setupMongo();
  } catch (err) {
    console.log(err);
  }
};
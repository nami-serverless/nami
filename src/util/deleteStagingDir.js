const { promisifiedRimraf, getNamiPath } = require('./fileUtils');
const namiLog = require('./../util/logger');
const namiErr = require('./../util/errorLogger');

module.exports = async function deleteStagingDir(lambdaName, homedir) {
  const stagingDir = `${getNamiPath(homedir)}/staging/${lambdaName}`;

  try {
    await promisifiedRimraf(stagingDir);
    namiLog(`${stagingDir} deleted`);
  } catch (err) {
    namiErr(err.message);
  }
};

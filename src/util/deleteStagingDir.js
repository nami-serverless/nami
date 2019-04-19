const { promisifiedRimraf, getNamiPath } = require('./fileUtils');
const namiErr = require('../util/errorLogger');

module.exports = async function deleteStagingDir(lambdaName, homedir) {
  const stagingDir = `${getNamiPath(homedir)}/staging/${lambdaName}`;

  try {
    await promisifiedRimraf(stagingDir);
  } catch (err) {
    namiErr(err.message);
  }
};

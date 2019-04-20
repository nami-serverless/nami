const { promisifiedRimraf, getNamiPath } = require('./fileUtils');

module.exports = async function deleteStagingDir(lambdaName, homedir) {
  const stagingDir = `${getNamiPath(homedir)}/staging/${lambdaName}`;

  try {
    await promisifiedRimraf(stagingDir);
  } catch (err) {
    return err;
  }
  return true;
};

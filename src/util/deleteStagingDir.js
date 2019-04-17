const { promisifiedRimraf, getNamiPath } = require('./fileUtils');

module.exports = async function deleteStagingDir(lambdaName, homedir) {
  const stagingDir = `${getNamiPath(homedir)}/staging/${lambdaName}`;

  try {
    await promisifiedRimraf(stagingDir);
    console.log(`${stagingDir} deleted`);
  } catch (err) {
    console.log(err.message);
  }
}

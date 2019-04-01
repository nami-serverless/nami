const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { getStagingPath } = require('./fileUtils');

const cwd = process.cwd();

const unzipper = async (lambdaName) => {
  const file = `${cwd}/${lambdaName}/${lambdaName}.zip`;

  try {
    await exec(`unzip ${file}`, { cwd: `${cwd}/${lambdaName}` });
  } catch (err) {
    console.log(err); // need to write to log
  }
};

const zipper = async (lambdaName, path, directoryName) => {
  const stagingPath = getStagingPath(path);
  let dirName = directoryName;

  if (dirName === undefined) dirName = lambdaName;
  const dir = `${stagingPath}/${dirName}`;

  try {
    await exec(`zip -r ${lambdaName}.zip .`, { cwd: dir });
  } catch (err) {
    console.log(err); // need to write to log
  }

  return `${dir}/${lambdaName}.zip`;
};

module.exports = { zipper, unzipper };

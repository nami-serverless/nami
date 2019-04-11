// const getUserDefaults = require('./getUserDefaults');
const init = require('./init');

const {
  getNamiPath,
  exists,
} = require('./fileUtils');

module.exports = async function catchSetupAndConfig(homedir, command) {
  const namiPath = await getNamiPath(homedir);
  const namiDirExists = await exists(namiPath);

  if (!namiDirExists && command === 'deploy') {
    const isInitialized = await init(homedir);

    if (!isInitialized) return false;
  }

  return true;
};

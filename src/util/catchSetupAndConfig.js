// const getUserDefaults = require('./getUserDefaults');
const init = require('./init');
const namiRole = 'namiRole';

const {
  readConfig,
  getNamiPath,
  exists,
} = require('./fileUtils');

const commands = [
  'create',
  'deploy',
  'redeploy',
  'list',
  'get',
  'delete',
  'config',
  'dbtable',
  'help',
  'version',
];
const commandIsNotValid = command => !commands.includes(command);

module.exports = async function catchSetupAndConfig(homedir, command) {
  const namiPath = await getNamiPath(homedir);
  const namiDirExists = await exists(namiPath);

  if (!namiDirExists) {
    const isInitialized = await init(namiRole, homedir);

    // don't continue if init incomplete, don't config twice
    if (!isInitialized || command === 'config') return false;
  }

  return true;
};

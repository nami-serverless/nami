const create = require('./create');
const deploy = require('./deploy');
const destroy = require('./destroy');
const list = require('./list');
const namiErr = require('../util/errorLogger');

module.exports = async function executeCommand(command, resourceName, homedir) {
  if (command === 'create') {
    await create(resourceName, homedir);
  } else if (command === 'deploy') {
    await deploy(resourceName, homedir);
  } else if (command === 'destroy') {
    await destroy(resourceName, homedir);
  } else if (command === 'list') {
    await list(homedir);
  } else {
    namiErr(`Command: ${command} is not valid.`);
  }
};

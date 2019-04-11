const create = require('./create');
const deploy = require('./deploy');
const destroy = require('./destroy');
const list = require('./list');
const namiLog = require('./../util/logger');

module.exports = async function executeCommand(command, resourceName, options, homedir) {
  if (command === 'create') {
    await create(resourceName, homedir);
  } else if (command === 'deploy') {
    await deploy(resourceName, options, homedir);
  } else if (command === 'destroy') {
    await destroy(resourceName, options, homedir);
  } else if (command === 'list') {
    await list(homedir);
  } else {
    namiLog(`Command: ${command} is not valid.`);
  }
};

const deploy = require('./deploy');

module.exports = async function executeCommand(command, resourceName, options, homedir) {
  if (command === 'deploy') {
    await deploy(resourceName, options, homedir);
  } else {
    console.log(`Command: ${command} is not valid.`);
  }
};

const namiLog = require('./logger');
const { doesAPIResourceExist } = require('./../aws/doesResourceExist');
const isValidResourceName = require('./isValidResourceName');

const commandsWithResource = [
  'deploy',
  'destroy',
  'create',
];
const commandWithResource = command => commandsWithResource.includes(command);

module.exports = async function handleArgs(args, command, homedir) {
  let resourceName = '';
  let invalidName = false;
  let resourceExists = false;

  if (commandWithResource(command)) {
    [resourceName] = args;

    const apiResourceExists = await doesAPIResourceExist(resourceName, homedir);

    if (!isValidResourceName(resourceName)) {
      namiLog('Resource name must be between 1 and 64 characters in length. It may only contain alphanumeric characters or - or _.');
      invalidName = true;
    } else {
      resourceName = resourceName.toLowerCase();

      if (apiResourceExists && (['deploy', 'create'].includes(command))) {
        resourceExists = true;
      }
    }
  }

  return {
    resourceName,
    invalidName,
    resourceExists,
  };
};

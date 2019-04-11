const namiLog = require('./logger');
const { doesAPIResourceExist } = require('./../aws/doesResourceExist');
const isValidResourceName = require('./isValidResourceName');

const getOptions = (flags) => {
  const options = {};
  const formattedOptions = flags
    .join(' ')
    .split('--')
    .slice(1)
    .map(elements => elements.trim());

  formattedOptions.forEach((optionStr) => {
    const [key, ...values] = optionStr.split(' ');
    options[key] = values;
  });

  return options;
};

const commandsWithResource = [
  'deploy',
  'destroy',
  'create',
];
const commandWithResource = command => commandsWithResource.includes(command);

let invalidNameOrFlag = false;

module.exports = async function handleArgs(args, command, homedir) {
  let options;
  let resourceName = '';
  let resourceExists = false;

  if (commandWithResource(command)) {
    [resourceName, ...options] = args;
    options = getOptions(options);
  } else {
    options = getOptions(args);
  }

  const apiResourceExists = await doesAPIResourceExist(resourceName, homedir);

  if (!isValidResourceName(resourceName) && Object.keys(options).length === 0) {
    namiLog('Resource name must be between 1 and 64 characters in length. It may only contain alphanumeric characters or - or _.');
    invalidNameOrFlag = true;
  } else {
    resourceName = resourceName.toLowerCase();

    if (apiResourceExists && (['deploy', 'create'].includes(command))) {
      resourceExists = true;
    }
  }

  return {
    resourceName,
    options,
    invalidNameOrFlag,
    resourceExists,
  };
};

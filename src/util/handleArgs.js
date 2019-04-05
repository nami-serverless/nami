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
];
const commandWithResource = command => commandsWithResource.includes(command);

module.exports = function handleArgs(args, command) {
  let options;
  let resourceName = '';

  if (commandWithResource(command)) {
    [resourceName, ...options] = args;
    options = getOptions(options);
  } else {
    options = getOptions(args);
  }

  resourceName = resourceName[0].toUpperCase().concat(resourceName.slice(1).toLowerCase());

  return {
    resourceName,
    options,
  };
};

const { doesAPIResourceExist } = require('../aws/doesResourceExist');

const validateResourceExists = async (resourceName, homedir, command) => {
  const apiResourceExists = await doesAPIResourceExist(resourceName, homedir);
  if (apiResourceExists && ['create', 'deploy'].includes(command)) {
    throw new Error(`${resourceName} endpoint already exists`);
  } else if (!apiResourceExists && command === 'destroy') {
    throw new Error(`${resourceName} endpoint does not exist`);
  }
};

const missingResourceName = (resourceName) => {
  if (resourceName === '') {
    throw new Error('Must specify resource name');
  }
};

const validateResourceName = async (resourceName) => {
  const regex = /^[a-zA-Z0-9-_]{1,64}$/;

  if (!regex.test(resourceName)) {
    throw new Error('Resource name must be between 1 and 64 characters in length. It may only contain alphanumeric characters or - or _.');
  }
};

module.exports = {
  validateResourceName,
  validateResourceExists,
  missingResourceName,
};

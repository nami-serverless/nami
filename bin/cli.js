#!/usr/bin/env node
const os = require('os');
const catchSetupAndConfig = require('./../src/util/catchSetupAndConfig');
const executeCommand = require('../src/commands/executeCommand');
const namiErr = require('./../src/util/errorLogger');

const {
  validateResourceExists,
  validateResourceName,
  missingResourceName,
} = require('../src/util/validations');

const [,, command, ...args] = process.argv;
const homedir = os.homedir();

(async () => {
  try {
    let [resourceName] = args;
    resourceName = resourceName ? resourceName.toLowerCase() : '';

    if (args.length > 1) {
      throw new Error('Invalid command - too many arguments');
    }

    if (command === 'create' || command === 'deploy') {
      await validateResourceExists(resourceName, homedir, command);
      await validateResourceName(resourceName);
    } else if (command === 'destroy') {
      missingResourceName(resourceName);
      await validateResourceExists(resourceName, homedir, command);
    }

    await catchSetupAndConfig(homedir, command);
    await executeCommand(command, resourceName, homedir);
  } catch (err) {
    namiErr(`Command Line Interface error => ${err.message}`);
  }
})();

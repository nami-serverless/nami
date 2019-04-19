#!/usr/bin/env node
const os = require('os');
const catchSetupAndConfig = require('./../src/util/catchSetupAndConfig');
const executeCommand = require('../src/commands/executeCommand');
const handleArgs = require('./../src/util/handleArgs');
const namiLog = require('./../src/util/logger');
const namiErr = require('./../src/util/errorLogger');

const [,, command, ...args] = process.argv;
const homedir = os.homedir();

(async () => {
  try {
    let resourceName;
    let invalidName;
    let resourceExists;

    if (args.length === 1) {
      ({ resourceName, invalidName, resourceExists } = await handleArgs(args, command, homedir));

      if (invalidName) { return; }

      if (resourceExists && command === 'deploy') {
        namiErr(`${resourceName} endpoint already exists`);
        return;
      }
    } else if (args.length > 1) {
      namiErr('Invalid command - too many arguments');
      return;
    }

    await catchSetupAndConfig(homedir, command);
    await executeCommand(command, resourceName, homedir);
  } catch (err) {
    namiLog(`Command Line Interface error => ${err.message}`);
  }
})();

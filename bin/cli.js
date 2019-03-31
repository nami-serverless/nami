#!/usr/bin/env node
const os = require('os');
const catchSetupAndConfig = require('./../src/util/catchSetupAndConfig');
const executeCommand = require('../src/commands/executeCommand');

const [,, command, ...args] = process.argv;
const homedir = os.homedir();

(async () => {
  try {
    let resourceName = 'preLambda';
    let options = {};

    const shouldContinue = await catchSetupAndConfig(homedir, command);

    if (!shouldContinue) { return };
    await executeCommand(command, resourceName, options, homedir);
  } catch (err) {

  }
})();

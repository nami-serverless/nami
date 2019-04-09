#!/usr/bin/env node
const os = require('os');
const catchSetupAndConfig = require('./../src/util/catchSetupAndConfig');
const executeCommand = require('../src/commands/executeCommand');
const handleArgs = require('./../src/util/handleArgs');
const namiLog = require('./../src/util/logger');

const [,, command, ...args] = process.argv;
const homedir = os.homedir();

(async () => {
  try {
    let resourceName;
    let options = {};
    let invalidNameOrFlag;

    if (args) ({ resourceName, options, invalidNameOrFlag } = handleArgs(args, command));

    const shouldContinue = (await catchSetupAndConfig(homedir, command));

    if (!shouldContinue || invalidNameOrFlag) {
      namiLog('goodbye!');
      return;
    };
    await executeCommand(command, resourceName, options, homedir);
  } catch (err) {
    namiLog(`Command Line Interface error => ${err.message}`)
  }
})();

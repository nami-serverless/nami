#!/usr/bin/env node
const os = require('os');
const catchSetupAndConfig = require('./../src/util/catchSetupAndConfig');
const executeCommand = require('../src/commands/executeCommand');
const handleArgs = require('./../src/util/handleArgs');

const [,, command, ...args] = process.argv;
const homedir = os.homedir();

(async () => {
  try {
  	let resourceName;
    let options = {};

    if (args) ({ resourceName, options, invalidNameOrFlag } = handleArgs(args, command));

    const shouldContinue = (await catchSetupAndConfig(homedir, command));

    if (!shouldContinue || invalidNameOrFlag) {
      console.log('goodbye!');
      return;
    };
    await executeCommand(command, resourceName, options, homedir);
  } catch (err) {

  }
})();

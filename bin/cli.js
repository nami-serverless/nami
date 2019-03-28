#!/usr/bin/env node
const os = require('os');

const executeCommand = require('../src/commands/executeCommand');

const [,, command, ...args] = process.argv;
const homedir = os.homedir();

(async () => {
  try {
    let resourceName;
    let options = {};
    
    await executeCommand(command, resourceName, options, homedir);
  } catch (err) {

  }
})();

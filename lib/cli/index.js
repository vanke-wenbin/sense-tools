#!/usr/bin/env node

'use strict';

require('colorful').colorful();

const program = require('commander');

const pkgInfo = require('../../package.json');

program
  .version(pkgInfo.version)
  .command('upload', 'upload specified task')
  .command('mail', 'mail notify specified task')
  .parse(process.argv);

const proc = program.runningCommand;
if (proc) {
  proc.on('close', process.exit.bind(process));
  proc.on('error', () => {
    process.exit(1);
  });
}

process.on('SIGINT', () => {
  if (proc) {
    proc.kill('SIGKILL');
  }
  process.exit(0);
});

var subCmd = program.args[0];
if (!subCmd || subCmd !== 'upload' || subCmd !== 'mail') {
  program.help();
}

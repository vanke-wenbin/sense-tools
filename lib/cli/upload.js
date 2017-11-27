#!/usr/bin/env node

'use strict';

require('colorful').colorful();

const program = require('commander');

program
  .option('--bucket [name]', `${'*'.to.magenta.color} set QINIU bucket name`)
  .option('--target [directory]', `${'*'.to.magenta.color} set target directory`)
  .on('--help', () => {
    console.log();
    console.log('  Usage:'.to.bold.blue.color);
    console.log('    $', 'sense-tools upload --bucket bucket_name --target build'.to.magenta.color)
  })
  .parse(process.argv);

const {
  bucket,
  target,
} = program;

if (!bucket || !target) {
  program.help();
} else {
  require('../qiniu/upload');
}

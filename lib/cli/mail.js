#!/usr/bin/env node

'use strict';

require('colorful').colorful();

const program = require('commander');

program
  .option('--to [receivers]', 'add receivers list')
  .option('--subject [subject]', 'set mail subject')
  .option('--cc [cc]', 'add cc list')
  .option('--bcc [bcc]', 'add bcc list')
  .on('--help', () => {
    console.log();
    console.log('  Usage:'.to.bold.blue.color);
    console.log('    $', 'sense-tools mail --to user01@vanke.com,user02@vanke.com'.to.magenta.color)
    console.log('    $', 'sense-tools mail --subject release new version'.to.magenta.color)
    console.log('    $', 'sense-tools mail --cc user01@vanke.com,user02@vanke.com'.to.magenta.color)
    console.log('    $', 'sense-tools mail --bcc user01@vanke.com,user02@vanke.com'.to.magenta.color)
  })
  .parse(process.argv);

require('../mail/notify');

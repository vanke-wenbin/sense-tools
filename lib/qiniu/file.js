'use strict';

const fs = require('fs');
const { resolve, join } = require('path');

function scanFiles(dir) {
  const files = [];

  (function loopScan(path, file = '') {
    const stats = fs.statSync(path);
    if (stats.isFile()) {
      files.push(file);
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(path);
      if (files instanceof Array && files.length > 0) {
        files.forEach((fileName) => {
          loopScan(join(path, fileName), join(file, fileName));
        });
      }
    }
  })(dir);

  return files;
}

module.exports = {
  scanFiles,
};

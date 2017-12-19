'use strict';

const fs = require('fs');
const { resolve, join } = require('path');
const argv = require('minimist')(process.argv.slice(2));

const {
  KEYS: {
    ACCESS_KEY,
    SECRET_KEY,
  },
} = require('../../config/qiniu');

const QiniuHelper = require('./helper');

const { bucket, target } = argv;

const qiniuHelper = new QiniuHelper(ACCESS_KEY, SECRET_KEY, bucket);

const uploadDir = resolve(process.cwd(), target);

function uploadFile(path, file = '') {
  const stats = fs.statSync(path);
  if (stats.isFile()) {
    // Path.join.sep returns '\\' on Windows,
    // the key we use for QINIU uploading should be 'path/file' pattern.
    qiniuHelper.upload(file.replace(/\\/g, '/'), resolve(path));
  } else if (stats.isDirectory()) {
    fs.readdir(path, (err, files) => {
      if (err) {
        console.error('Error happened when reading dir: ', path, err);
        return;
      }

      files.forEach((f) => {
        uploadFile(join(path, f), join(file, f));
      });
    });
  }
}

fs.access(uploadDir, fs.constants.R_OK, (err) => {
  if (err) {
    throw new Error(err.Error);
  }

  uploadFile(uploadDir);
});

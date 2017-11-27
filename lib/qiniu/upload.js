'use strict';

const fs = require('fs');
const { resolve, join } = require('path');
const argv = require('minimist')(process.argv.slice(2));

const QiniuHelper = require('./qiniu/helper');
const QiniuConfig = require('./qiniu/config');

const { bucket, target } = argv;
const env = process.env.NODE_ENV || 'development';
const { APP_KEY, SECRET_KEY } = QiniuConfig[env];

const qiniuHelper = new QiniuHelper(APP_KEY, SECRET_KEY, bucket);

const uploadDir = resolve(process.cwd(), target);

function uploadFile(path, file = '') {
  const stats = fs.statSync(path);
  if (stats.isFile()) {
    QiniuHelper.upload(file, resolve(path));
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

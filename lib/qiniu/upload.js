'use strict';

const fs = require('fs');
const { resolve, join } = require('path');
const argv = require('minimist')(process.argv.slice(2));

const QiniuHelper = require('./helper');
const { scanFiles } = require('./file');
const { ACCESS_KEY, SECRET_KEY } = require('./config');

const { bucket, target } = argv;
const qiniuHelper = new QiniuHelper(ACCESS_KEY, SECRET_KEY, bucket);
const uploadDir = resolve(process.cwd(), target);

// 更新: 20180322
// 七牛华东地区单个 IP 有并发限制，允许最高 32 个并发数
const CONCURRENCY_COUNT = 28;

fs.access(uploadDir, fs.constants.R_OK, (err) => {
  if (err) {
    console.error(err);
  }

  const files = scanFiles(uploadDir);
  (function loopUpload(files) {
    const batchFiles = files.splice(0, CONCURRENCY_COUNT);
    if (batchFiles.length === 0) {
      return;
    }

    qiniuHelper.batchUpload(batchFiles, uploadDir, (errorFiles) => {
      if (errorFiles && errorFiles.length > 0) {
        files.push(errorFiles);
      }

      loopUpload(files);
    });
  })(files);
});

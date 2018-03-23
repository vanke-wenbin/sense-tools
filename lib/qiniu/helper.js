'use strict';

/**
 *  Upload asssets to Qiniu
 *  Use Qiniu SDK, visit: https://developer.qiniu.com/kodo/sdk/1289/nodejs
 *
 */
const { resolve } = require('path');
const qiniu = require('qiniu');

function QiniuHelper(accessKey, secretKey, bucket) {
  this.ACCESS_KEY = accessKey;
  this.SECRET_KEY = secretKey;
  this.BUCKET = bucket;

  this.init();
}

QiniuHelper.instance = null;

QiniuHelper.getInstance = () => {
  if (QiniuHelper.instance === null) {
    QiniuHelper.instance = new QiniuHelper();
  }

  return QiniuHelper.instance;
};

QiniuHelper.prototype = {

  init() {
    if (!this.available()) {
      console.warn('Invalid ACCESS_KEY or SECRET_KEY');
    } else {
      this.config();
    }
  },

  config() {
    qiniu.conf.ACCESS_KEY = this.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = this.SECRET_KEY;
  },

  available() {
    return this.ACCESS_KEY !== '' && this.SECRET_KEY !== '';
  },

  uptoken(bucket = this.BUCKET, key) {
    let policyKey = bucket;
    if (key) {
      policyKey += `:${key}`;
    }
    const putPolicy = new qiniu.rs.PutPolicy(policyKey);
    return putPolicy.token();
  },

  /**
   *  fileName: 上传到七牛后保存的文件名
   *  filePath: 要上传文件的本地路径
   *  options: onComplete, onSuccess, onError
   */
  upload(fileName, filePath, options) {
    if (this.available()) {
      const key = fileName.replace(/\\/g, '/');
      const token = this.uptoken(this.BUCKET, key);
      // Path.join.sep returns '\\' on Windows OS,
      // the key we use for QINIU uploading should be 'path/file' pattern.
      const extra = new qiniu.io.PutExtra();
      const { onComplete, onSuccess, onError } = options;

      qiniu.io.putFile(token, key, filePath, extra, (err, ret, respInfo) => {
        if (onComplete) {
          onComplete();
        }

        if (err) {
          console.log('===== Error =====');
          console.log(`fileName: ${fileName}`);
          console.log(`error: ${JSON.stringify(err)}`);
          if (onError) {
            onError(fileName);
          }
        } else {
          console.log(`Done: ${ret.key}`);
          if (onSuccess) {
            onSuccess();
          }
        }
      });
    }
  },

  batchUpload(fileNames, basePath, onFinishCallback) {
    if (this.available()) {
      const errorFiles = [];
      let unhandleSize = fileNames.length;

      fileNames.forEach((fileName) => {
        this.upload(
          fileName,
          resolve(basePath, fileName),
          {
            onComplete: () => {
              unhandleSize -= 1;
              if (unhandleSize === 0 && onFinishCallback) {
                onFinishCallback(errorFiles);
              }
            },
            onError: (fileName) => {
              errorFiles.push(fileName);
            },
          }
        );
      });
    }
  },
};

module.exports = QiniuHelper;

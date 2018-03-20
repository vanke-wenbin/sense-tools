'use strict';

/**
 *  Upload asssets to Qiniu
 *  Use Qiniu SDK, visit: https://developer.qiniu.com/kodo/sdk/1289/nodejs
 *
 */
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

  uploadFile(uptoken, key, localFile) {
    const extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, (err, ret, respInfo) => {
      if (err) {
        console.log(`
          ====== Upload Error =====
          localFile: ${localFile};
          key: ${key};
          extra: ${extra};
          uptoken: ${uptoken};
          error: ${err};
          result: ${ret}; 
          respInfo: ${respInfo};
        `)
      } else {
        console.log(ret.hash, ret.key, ret);
      }
    });
  },

  /**
   *  key: 上传到七牛后保存的文件名
   *  filePath: 要上传文件的本地路径
   */
  upload(key, filePath) {
    if (this.available()) {
      const token = this.uptoken(this.BUCKET, key);
      this.uploadFile(token, key, filePath);
    }
  },
};

module.exports = QiniuHelper;

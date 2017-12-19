'use strict';

const BUCKET_DOMAIN = {
  'black-pearl': 'img2.4009515151.com',
  'vanke-app': 'img.4009515151.com',

  'uiis-test': 'p177rvoii.bkt.clouddn.com',
  'fg-test': 'p177h8nuu.bkt.clouddn.com',
};

module.exports.getQiniuDomainByBucketName = function(bucketName) {
  const domain = BUCKET_DOMAIN[bucketName];
  if (!domain) {
    throw new Error('Bucket ' + bucketName + ' is not registered.');
  }
  return domain;
};

const nodemailer = require('nodemailer');

const SENDER = '278095989@qq.com';

const H5_GROUP = [
  'liuwb06@vanke.com',
  'linz06@vanke.com',
  'huangyl15@vanke.com',
  'zhangl112@vanke.com',
];

const LEADER_GROUP = [
  'xuys01@vanke.com',
  'lincl@vanke.com',
  'luog04@vanke.com',
];

const DEFAULT_RECEIVERS = [
  ...LEADER_GROUP,
  ...H5_GROUP,
].join(',');

const mailTransport = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secureConnection: true,
  auth: {
    user: SENDER,
    pass: 'udwgmipiavambjef',
  },
});

exports.sender = SENDER;
exports.receivers = DEFAULT_RECEIVERS;
exports.mailTransport = mailTransport;

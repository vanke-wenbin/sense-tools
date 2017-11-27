'use strict';

const nodemailer = require('nodemailer');
const argv = require('minimist')(process.argv.slice(2));

const { NODE_ENV, RELEASE_LOG } = process.env;
if (NODE_ENV === 'production') {
  const { sender, receivers, mailTransport } = require('./config');

  const {
    to,
    subject,
    cc,
    bcc,
  } = argv;

  const addReceivers = to
    ? to.split(',')
      .map(receiver => receiver.replace(/\s/g, ''))
      .filter(receiver => !!receiver)
    : null;

  let toReceivers = receivers;
  if (addReceivers !== null && addReceivers.length > 0) {
    toReceivers = `${toReceivers}, ${addReceivers.join(',')}`;
  }

  const mailOptions = {
    from            : sender,
    to              : `${toReceivers}`,
    cc              : cc || '',
    bcc             : bcc || '',
    subject         : subject || '前端发版',
    text            : RELEASE_LOG || '发版的人很懒，没有留下发版日志',
  };

  mailTransport.sendMail(mailOptions, (err, msg) => {
    if (err) {
      console.log(err);
    } else {
      console.log('邮件发送成功', msg);
    }
  });
}

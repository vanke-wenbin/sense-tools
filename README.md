# SENSE-TOOLS

**Sense-tools** 工具提供开发便利工具：
- 上传目录到七牛bucket
```
sense-tools upload
  --bucket [bucket_name]
  --target [dir]
```
- 发送邮件（发版通知）
```
sense-tools mail
  -- to user01@vanke.com[,user02@vanke.com]    // add to default receivers list
  -- subject "Release Subject"
  -- cc user01@vanke.com[,user02@vanke.com]
  -- bcc user01@vanke.com[,user02@vanke.com]
```

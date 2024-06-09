#!/bin/bash
npm run build
rm -rf guide-manage && mv dist guide-manage
ssh root@zhangjianyong.top "rm -rf /usr/share/nginx/guide-manage/*"
scp -r ./guide-manage root@zhangjianyong.top:/usr/share/nginx/
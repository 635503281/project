#!/bin/bash
set -e
export NODE_ENV=production

export BUILD_ENV=$BUILD_ENV

echo ''
echo '>> Node.js: '`node -v`
echo '>> Npm: '`npm -v`
echo '>> Yarn: '`yarn --version`

# 设置 yarn 镜像地址
chmod +x ./deploy/npm_mirror.sh
./deploy/npm_mirror.sh

# npm 配置 (yarn通用)
npm config set strict-ssl false
npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
npm config set @quick:registry http://10.13.83.107:4873/
npm config set @kso:registry http://registry.npm.kwps.info

#  安装依赖 (需设置 production 为 false 才能安装 devDependencies)
yarn install --production=false
echo ""

# 开始编译
npm run build

# 清理 node_modules 减少发布包体积
rm -rf node_modules
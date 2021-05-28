#!/bin/bash

# 暴露全局变量
export NPM_MIRROR=""

# 外部注入变量 KAE_ENCS_NPM_MIRRORS="http://10.13.83.107:4873/,http://10.13.88.112:4873,http://registry.npmjs.org"
NPM_MIRRORS=(${KAE_KOA_NPM_MIRRORS//\,/ })

VERDACCIO_VERSION="0"

for MIRROR in ${NPM_MIRRORS[@]}
do
    RESP=`curl -I -m 10 -s -w %{http_code} $MIRROR || echo "000"`
    HTTP_CODE=`echo "$RESP" | sed -n '$p'`
    if (( $HTTP_CODE == "200" ))
    then
        NPM_MIRROR=$MIRROR
        # 从 header 中获取 x-powered-by
        POWERED_BY=`echo "$RESP" | grep 'X-Powered-By' | awk '{print $2}'`
        # verdaccio 镜像
        if [[ $POWERED_BY == verdaccio* ]];
        then
            # 从 x-powered-by 中获取 verdaccio 版本号
            VERSION=${POWERED_BY#"verdaccio/"}
            VERSION_ARR=(${VERSION//\./ })
            VERDACCIO_VERSION=${VERSION_ARR[0]}
        fi
        break
    fi
done

# 替换 yarn.lock 镜像仓库地址
if [ "$NPM_MIRROR" != "" ];then
    # 替换镜像仓库地址
    sed -i "s?\(resolved \"\)https*:\/\/registry.npm.taobao.org*\/?\1${NPM_MIRROR}\/?g" ./yarn.lock
	# 将 /download/部分替换成 /-/
    sed -i "s/\(resolved .*\)\/download\//\1\/-\//g" ./yarn.lock
    # verdaccio 镜像
    if [ "$VERDACCIO_VERSION" -gt 0 ];then
        # verdaccio 版本低于 4 时，需要把/-/@xxxx/替换成/-/
        if [ "$VERDACCIO_VERSION" -lt 4 ];then
            sed -i "s/\(resolved .*\)-\/@.*\//\1-\//g" ./yarn.lock
        fi
    fi
fi

NPM_MIRROR=${NPM_MIRROR:-'http://registry.npm.taobao.org'}

echo ""
if [ $POWERED_BY ]; then
  echo ">> 镜像信息: ${POWERED_BY}"
  echo ""
fi

yarn config set registry $NPM_MIRROR
echo ""

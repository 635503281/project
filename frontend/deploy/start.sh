mkdir -p /dev/shm/proxy_cache
chown -R nginx /dev/shm/proxy_cache
mkdir -p /etc/nginx/logs
# nginx 配置文件
pyjinja /$KAE_APP_NAME/nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
pyjinja /$KAE_APP_NAME/nginx/default.conf /usr/local/openresty/nginx/conf/vhost/default.conf
# 检查 nginx 配置文件
/usr/local/openresty/nginx/sbin/nginx -t
# supervisor 配置文件
pyjinja /$KAE_APP_NAME/supervisord/nginx.conf /etc/supervisord/nginx.conf
# 启动 supervisor
/usr/bin/supervisord -c /etc/supervisord.conf --nodaemon
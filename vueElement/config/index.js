'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
let target = "http://localhost:8081/";
// target = "http://10.41.74.89:6600/";
// target = "http://10.39.132.62:8080/";
// target = 'http://10.41.77.116:6600/';
// target = 'http://10.41.74.6:6600/';
// target = 'http://10.39.130.233:8080';
// target = "http://172.16.93.7:8080/";
// target = "http://10.39.132.56:8080";
target = "http://10.41.74.249:6600/";


const proxyConfig={//代理测试
    target: target,
    changeOrigin: true,
    secure: false,
    onProxyRes: function(proxyRes, req, res) {//代理收到请求之后将数据发给浏览器之前做一层拦截
      var cookies = proxyRes.headers['set-cookie'];
      if (cookies) {
          var newCookie = cookies.map(function(cookie) { 
              return cookie.split(";").map(function(value){
                  if(value.includes("Path="))value=" Path=/";
                  return value
              }).join(";");  //修改cookie的路径path
        
          });
          delete proxyRes.headers['set-cookie'];
          proxyRes.headers['set-cookie'] = newCookie;
      }
    },

}

let splitUrl = target.replace("http","ws").split(":");splitUrl[2] = "54405";
const proxySocket = {//代理socket
    target: splitUrl.join(":"),
    ws:true,
    // changeOrigin: true,
    secure:false,
}

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/mysocket':proxySocket,
      '/**': proxyConfig,
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8071, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool:"source-map", //'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',//项目跟路径

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

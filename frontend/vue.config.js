const path = require('path')
// const isProduction = process.env.NODE_ENV === 'production'
console.log('process.env.API_BASE_URL', process.env.API_BASE_URL);
module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 3000,
    public: '0.0.0.0',
    https: true,
    proxy: {
      '/comm/api': {
        target: process.env.API_BASE_URL||'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        // pathRewrite: {'/comm/api' : ''}
      },
      //代理图片
      '/picture': {
        target: process.env.API_BASE_URL||'http://localhost:3000',
        changeOrigin: true,
        onProxyReq(proxyReq, req, res){
          let url = req.url;
          url = '/comm/picture' + url.split('picture')[1];
          proxyReq.path = req.url = url;
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.vue', '.json', '.css', '.scss'],
      alias: {
        'static': path.resolve(__dirname, './static'),
        '@': path.resolve(__dirname, './src')
      }
    }
  },

  publicPath: '/comm',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  // pluginOptions: {
  //   htmlReplace: {
  //     patterns: [
  //       {
  //         match: /(\/comm\/js\/)/g,
  //         replacement: '/comm/js/'
  //       },
  //       {
  //         match: /(\/comm\/css\/)/g,
  //         replacement: '/comm/css/'
  //       }
  //     ]
  //   }
  // }
}

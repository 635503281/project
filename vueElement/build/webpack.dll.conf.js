const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: {
    //填写需要提取出来的依赖包
    //如果有些依赖包在index.html页面引入了cdn了就无需再引入了，否则会打包进js文件中，在页面重复引入代码。
    vendor:['vue','element-ui','vue-router','vuex','vue-i18n']
  },
  output: {
    path: path.join(__dirname, '../src/assets'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../', '[name]-manifest.json'),
      name: '[name]'
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {    
          warnings: false,// 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true,// 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true,// 内嵌定义了但是只用到一次的变量
          reduce_vars: true,// 提取出出现多次但是没有定义成变量去引用的静态值
        },
        output: {   
          beautify: false,// 最紧凑的输出 
          comments: false,// 删除所有的注释
        }
      },
      sourceMap:false,
      parallel: true
    }),
  ]
}
# community-web

## 本地项目部署
- 安装Node10+版本
- 安装Yarn

运行yarn serve

## 技术栈与项目架构

### 技术栈
Vue + Vue-Router + Vuex + Webpack

### 项目架构
```
  |-- .gitignore',
  |-- babel.config.js',
  |-- package.json',
  |-- README.md',
  |-- vue.config.js',
  |-- yarn.lock',
  |-- public',
      |   |-- favicon.ico',
      |   |-- index.html',
  |-- src',
      |-- App.vue',
      |-- main.js',
      |-- assets', // 组件静态
      |-- components', // 公共组件
      |-- router',
      |   |-- index.js',
      |-- services', // 请求服务
      |   |-- index.js',
      |-- store', // 状态管理
      |   |-- index.js',
      |   |-- moudles',
      |       |-- home',
      |       |   |-- actions.js',
      |       |   |-- getters.js',
      |       |   |-- index.js',
      |       |   |-- mutations.js',
      |-- util',
      |   |-- axios',
      |       |-- index.js',
      |       |-- method.js',
      |-- views' // 视图
]
```
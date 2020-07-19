// vue.config.js

const path = require("path");
module.exports = {
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 要公用的scss的路径
          resources: './src/assets/css/reset.scss'
        })
        .end()
    })
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["./src/icons"]
      });

  },
  lintOnSave: false,
  devServer: {
    port: 8080,
    open: false,
    host: '0.0.0.0',
    https: false,
    hot: true,
    hotOnly: false,
    proxy: {
      '/devapi': {
        target: 'http://www.web-jshtml.cn/productapi/token',
        changeOrigin: true,
        pathRewrite: {
          '^/devapi': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 别名
        vue$: "vue/dist/vue.esm.js", //加上这一句
        "@api": path.resolve(__dirname, "./src/api"),
        "@utils": path.resolve(__dirname, "./src/utils")
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, './src/assets/css/*.scss')      //你的.scss文件所在目录
      ]
    }
  }

}
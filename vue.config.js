// vue.config.js
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
  },
  lintOnSave: false,
  devServer: {
    port:8080,
    open:false,
    host:'0.0.0.0',
    https:false,
    hot:true,
    hotOnly:false,
    proxy: {
      '/devapi': {
        target: 'http://www.web-jshtml.cn/productapi',
        changeOrigin: true,
        pathRewrite: {
          '^/devapi': ''
        }
      }
    }
  }
}
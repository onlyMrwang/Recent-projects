'use strict'
const path = require('path')
// const packageName = require('./package').name;
const defaultSettings = require('./config/defaultSetting')


function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.sysTitle || '智慧机坪综合监控管理系统'

const port = 8080 // 端口

module.exports = {
  publicPath: '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'airport-admin',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: port,
    open: true,
    proxy: {
      ['/sys/system']: {
        target: `http://10.100.11.36:31510`,
        // target: `http://10.100.10.176:31510`,
        // target: `http://10.1.170.83:31577`,
        // target: `http://10.1.170.83:31577`,
        changeOrigin: true,
        pathRewrite: {
          ['^/sys']: ''
        }
      },
      ['/app']: {
        target: `http://10.100.11.36:31501`,
        // target: `http://10.100.11.38:31501`,
        // target: `http://10.100.10.176:31501`,
        // target: `http://10.1.170.83:31577`,
        // target: `http://10.1.170.82:31501`,
        changeOrigin: true,
        pathRewrite: {
          ['^/app']: ''
        }
      },
      ['/common']: {
        target: `http://10.100.11.36:31510`,
        // target: `http://10.100.10.176:31510`,
        // target: `http://10.1.170.83:31577`,
        changeOrigin: true,
        pathRewrite: {
          ['^/common']: ''
        }
      },
      ['/webroot']: {
        target: `http://10.100.11.42:8080`,
        changeOrigin: true,
        pathRewrite: {
          ['^/webroot']: '/webroot'
        }
      },
      ['/bms']: {
        target: `http://10.100.10.173:31532`,
        changeOrigin: true,
        pathRewrite: {
          ['^/bms']: ''
        }
      },
      ['/group1']: {
        target: `http://10.100.11.15:30082/group1`,
        changeOrigin: true,
        pathRewrite: {
          ['^/group1']: ''
        }
      }
    },
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  },
  chainWebpack(config) {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = name
        return args
      })
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })

          // set svg-sprite-loader
          config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end()
          config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
              symbolId: 'icon-[name]'
            })
            .end()

          config.optimization.runtimeChunk('single'),
          {
            from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
            to: './', //到根目录下
          }
        }
      )
  }
}

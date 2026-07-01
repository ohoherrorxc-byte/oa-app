const webpack = require('webpack')
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  //路径前缀
  publicPath: process.env.BASE_URL,
  // lint 只警告不阻塞构建（避免升级 vue-cli 5 后大量老代码触发 lint error 卡住打包）
  lintOnSave: 'warning',
  productionSourceMap: false,
  // index: {
  //   entry: 'src/main.js',
  //   template: 'public/index.html',
  //   filename: 'index.html'
  // },
  // // APP专用入口 - 仅包含需要嵌入的模块
  // app: {
  //   entry: 'src/app-main.js',
  //   template: 'public/app.html',
  //   filename: 'app.html'
  // },
  // configureWebpack: {
  //   optimization: {
  //     splitChunks: {
  //       cacheGroups: {
  //         vendor: {
  //           test: /[\\/]node_modules[\\/]/,
  //           name: 'vendor',
  //           priority: -10,
  //           reuseExistingChunk: true
  //         },
  //         // 仅APP入口的代码分割
  //         app: {
  //           test: /[\\/]src[\\/]views[\\/]AppFeature\.vue/,
  //           name: 'app-feature',
  //           priority: 20,
  //           reuseExistingChunk: true
  //         }
  //       }
  //     }
  //   }
  // },
  configureWebpack: config => {
    // 修复 pdfjs-dist@2.x 的 Array.prototype 污染问题：
    //   pdfjs-dist@2 主版本会给 Array.prototype 添加 remove 等可枚举方法，
    //   引发 `for...in` 遍历数组时报错 "Array.prototype contains unexpected enumerable properties"。
    //   官方 legacy 构建（pdfjs-dist/legacy/build/pdf.*）不会污染原型，
    //   这里通过 alias 把 pdfvuer 引用的主构建重定向到 legacy 构建，功能不变。
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pdfjs-dist/build/pdf$': 'pdfjs-dist/legacy/build/pdf',
      'pdfjs-dist/build/pdf.worker$': 'pdfjs-dist/legacy/build/pdf.worker',
      'pdfjs-dist/build/pdf.worker.entry$': 'pdfjs-dist/legacy/build/pdf.worker.entry',
    };
    // 如果是在线上环境
    config.optimization = {
      ...config.optimization,
      // 将 runtime 单独抽离，提升长期缓存命中率（配合 preload 让首屏更稳）
      runtimeChunk: 'single',
      // webpack4：生产用 hashed 让缓存更稳定，开发用 named 方便调试
      moduleIds: process.env.NODE_ENV === 'production' ? 'hashed' : 'named',
      splitChunks: {
        chunks: 'all', // 对所有类型的 chunks 进行拆分（同步和异步）
        minSize: 30000, // 文件大小超过 30KB 才拆分（减少首屏请求碎片）
        minChunks: 1, // 至少被引用一次才拆分
        maxAsyncRequests: 20, // 每个异步加载模块最多拆分成 20 个 chunks
        maxInitialRequests: 10, // 首屏初始加载请求数上限（过多会拖慢首屏）
        automaticNameDelimiter: '~', // 文件名分隔符
        cacheGroups: {
          // 1. 提取第三方库（node_modules）
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10, // 优先级，数值越大优先级越高
            name: 'vendors', // 打包后的文件名
            chunks: 'initial' // 避免把仅异步路由用到的库“拉进”首屏
          },
          // 2. 关闭 common 合并：业务模块各自走路由 chunk,首屏不再拉整个 common.js
          //    原配置 minChunks: 2 太激进,views/contract (826KB) 等业务模块全被打进 common,
          //    进入任何页面首次加载都要拉这个 818KB gzipped 的巨型 chunk
          //    关闭后这些代码会随各自的路由 chunk 按需加载
          common: false
        }
      }
    }
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        // gzip，压缩js
        new CompressionWebpackPlugin({
          algorithm: "gzip",//表示使用gzip算法进行压缩
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),//正则匹配文件名
          threshold: 10240,//文件大小阀值，大于或者等于10240字节(10kb)
          minRatio: 0.8,//最小压缩比例，只有压缩后大小与原始大小的比例大于等于该值时，才会保留压缩后的文件。这里设置为 0.8，表示压缩后的文件大小至少为原始文件大小的 80%。
        })
      )
    }
  },
  chainWebpack: (config) => {
    // 让首屏关键资源更早下载（恢复 preload；同时黑名单掉无用文件）
    if (process.env.NODE_ENV === 'production' && config.plugins.has('preload')) {
      config.plugin('preload').tap(args => {
        args[0] = {
          rel: 'preload',
          include: 'initial',
          fileBlacklist: [/\.map$/, /hot-update\.js$/]
        }
        return args
      })
    }
    // 删除需要预先获取(将来的页面)的资源
    config.plugins.delete('prefetch')
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test')
      config.devtool('eval-source-map');
    if (process.env.NODE_ENV === 'production') {
      config.devtool(false).end();
      config.plugin('SourceMapDevToolPlugin')
        .use(webpack.SourceMapDevToolPlugin).tap(args => {
          return [{
            filename: '[file].map',
            append: "\n//# sourceMappingURL=sourcemap/[url]",
          }];
        });
      config.plugin('FileManagerPlugin')
        .use(FileManagerPlugin).tap(args => {
          return [{
            events: {
              onEnd: {
                copy: [{
                  source: './dist/js/*.map',
                  destination: './dist/js/sourcemap',
                }],
                delete: ['./dist/js/*.map']
              }
            }
          }];
        });
    }
    //忽略的打包文件
    config.externals({
      // 'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      // 'element-ui': 'ELEMENT',
    });
    const entry = config.entry('app');
    entry.add('babel-polyfill').end();
    entry.add('classlist-polyfill').end();
  },
  css: {
    extract: { ignoreOrder: true }
  },
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      '/api': {
        //本地服务接口地址188
        target: 'http://10.30.5.188:8050',//徐畅 'http://10.30.5.188:8050', //oa_test 'http://10.30.5.175:8050',//曹工 http://10.30.5.85:8050 http://10.30.5.175:8050, 测试环境'https://10.30.4.61:30239'7
        //target: 'http://10.135.99.50:8089/api',
        //ceshi
        //远程演示服务地址,可用于直接启动项目zhua
        //target: 'https://saber.bladex.vip/api',
        disableHostCheck: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
};

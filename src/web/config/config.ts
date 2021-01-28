import path from 'path'
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin'

const webRoot = path.resolve(__dirname, '..')

export default {
  title: '监控平台',
  // dva: {
  //   immer: true,
  //   skipModelValidate: true,
  // },
  outputPath: '../../client/',
  publicPath: '/',
  // dynamicImport: {
  //   loading: path.join(webRoot, 'components', 'Loading.jsx'),
  // },
  hash: true,
  alias: {
    '@': webRoot,
    assets: path.join(webRoot, 'assets'),
    components: path.join(webRoot, 'components'),
    pages: path.join(webRoot, 'pages'),
    js: path.join(webRoot, 'assets/js'),
    hooks: path.join(webRoot, 'hooks'),
  },
  chainWebpack(config) {
    // config.module
    //   .rule('optimize-svg')
    //   .test(/\.svg$/)
    //   .use('svgo')
    //   .loader('svgo-loader')
    config.plugin('AntdDayjsWebpackPlugin').use(AntdDayjsWebpackPlugin)
  },
}

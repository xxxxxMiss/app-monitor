import path from 'path'
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin'
import { defineConfig } from 'umi'
import routes from './routes'

const webRoot = path.resolve(__dirname, '..')

export default defineConfig({
  title: '监控平台',
  // routes,
  antd: {
    dark: true,
    compact: true,
  },
  layout: {
    name: 'Ant Design',
    navTheme: 'dark',
    primaryColor: '#1890ff',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    title: 'Ant Design Pro',
    pwa: false,
    iconfontUrl: '',
    menu: {
      locale: false,
    },
    headerHeight: 48,
    splitMenus: false,
  },
  // dva: {
  //   immer: true,
  //   skipModelValidate: true,
  // },
  outputPath: '../../client/',
  publicPath: '/',
  dynamicImport: {
    loading: path.join(webRoot, 'components', 'loading', 'Loading.tsx'),
  },
  extraBabelPlugins: [
    [
      path.join(webRoot, 'plugins', 'babel-plugin-style-bind'),
      {
        varName: 'sx',
        includes: [path.join(webRoot, 'pages', '**', '*.{jsx,tsx}')],
      },
    ],
  ],
  hash: true,
  alias: {
    '@': webRoot,
    assets: path.join(webRoot, 'assets'),
    components: path.join(webRoot, 'components'),
    pages: path.join(webRoot, 'pages'),
    js: path.join(webRoot, 'assets/js'),
    hooks: path.join(webRoot, 'hooks'),
    utils: path.join(webRoot, 'utils'),
  },
  chainWebpack(config) {
    // config.module
    //   .rule('optimize-svg')
    //   .test(/\.svg$/)
    //   .use('svgo')
    //   .loader('svgo-loader')
    config.plugin('AntdDayjsWebpackPlugin').use(AntdDayjsWebpackPlugin)
  },
  define: {
    'process.env.axiosBaseURL': 'http://localhost:3000/api',
  },
  copy: [
    {
      from: 'assets/imgs',
      to: 'imgs',
    },
  ],
})

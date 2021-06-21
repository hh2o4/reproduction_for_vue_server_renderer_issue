const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const routerBase = process.env.ROUTER_BASE || 'test';
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const cssLoader = [
  {
    loader: 'css-loader',
    options: { minimize: isProd },
  }
];

const webpackCommonPlugins = [
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: 'common.[chunkhash].css',
  }),
  ...(isProd ? [] : [new FriendlyErrorsPlugin()]),
];

module.exports = {
  mode: NODE_ENV,
  devtool: isProd ? false : '#cheap-module-source-map',
  output: {
    path: resolve('dist'),
    publicPath: `/${routerBase}/dist/`,
    library: 'TEST',
    jsonpFunction: 'TESTJonsp',
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      public: resolve('public'),
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
    extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.json', '.vue'],
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false,
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('node_modules/vue-echarts')],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['happypack/loader?id=ts'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(sc|c)ss$/,
        oneOf: [
          {
            test: /^App\.vue$/,
            resourceQuery: /\?vue/,
            use: [MiniCssExtractPlugin.loader, ...cssLoader],
          },
          {
            use: ['vue-style-loader', ...cssLoader],
          },
        ],
      },
    ],
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false,
  },
  plugins: webpackCommonPlugins,
};

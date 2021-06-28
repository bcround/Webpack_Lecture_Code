const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common');

const config = {
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'venders',
          chunks: 'all'
        }
      }
    },
    minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
    minimize: true
  },
  mode: 'production'
};

module.exports = merge(common, config);

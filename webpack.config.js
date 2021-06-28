const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: '[name].[chunkhash].js', // name이란 키워드는 entry파일 이름 혹은 웹팩 설정 파일 내에서 name프로퍼티에 할당한 값이 적용되는 공간이다.
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // {
          //   loader: 'style-loader',
          //   options: {
          //     injectType: 'singletonStyleTag'
          //   }
          // },
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash].css'
    }),
    new HtmlwebpackPlugin({
      title: 'Webpack',
      template: './template.hbs',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0'
      },
      minify: {
        collapseWhitespace: true, // 공백을 제거해줌
        useShortDoctype: true, // Doctype을 줄여줌
        removeScriptTypeAttributes: true
      }
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    // optimization이라는 키는 웹팩의 bundle파일을 최적화 시켜주는 역할을 한다. chunk단위로 파일을 쪼개는 것도 bundle파일을 최적의 상태로 만들어주는 것이기 때문에, 이 키를 통해 설정을 한다.
    runtimeChunk: {
      // 이렇게하면 런타임코드가 따로 chunk로 분류된다.
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/, // test키를 통해 공통으로 묶는 chunk 파일이 node_modules폴더내에 해당되는 모듈들이라고 정의를 했다.
          name: 'venders',
          chunks: 'all'
        }
      }
    },
    minimizer: [new CssMinimizerPlugin()], // 이것만 작성하면 production mode에서만 작동한다.
    minimize: true // 그러므로 minimize값을 true로 주게되면 development mode에서도 CSS optimization이 된다.
  },
  mode: 'none'
};

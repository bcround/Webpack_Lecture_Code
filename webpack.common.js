const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'PRODUCTION';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // {
          //   loader: 'style-loader',
          // style-loader는 처리하는 css 파일별로 style tag를 만든다.
          // style tag 하나에서 한 번에 스타일 정보들을 읽어올 수 있도록 하려면 style-loader options에서 injectType을 singletonStyleTag로 정해줘야 한다.
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
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // svg파일같은경우에는 url loader에서 다뤄볼 것이다.
        use: [
          {
            loader: 'file-loader',
            options: {
              name() {
                // name 옵션은 함수로도 줄 수 있는데 개발 모드에서는 개발하기 편하게 asset들의 이름이 나오게 해주고 production일때는 해쉬값이 적용되게 설정해준다.
                if (!isProduction) {
                  return '[path][name].[ext]';
                }

                return '[contenthash].[ext]';
              }, // ext는 확장자(extension)의 약자이다.
              publicPath: 'assets/', // assets폴더 안의 파일들을 보겠다.
              outputPath: 'assets/' // 실제로 빌드가되고나서 file loader를 통해 file이 생성되는 경로를 개입할 수 있게 해주는 키, dist폴더내에 assets폴더를 만들어 asset들을 거기에 담겠다.
            }
          }
        ]
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
      minify: isProduction // production mode이면 minify로 압축을 하고 개발모드이면 압축을 안한다.
        ? {
            collapseWhitespace: true,
            useShortDoctype: true,
            removeScriptTypeAttributes: true
          }
        : false
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      IS_PRODUCTION: isProduction // 모듈 전역으로 제공되는 상속값을 접근하기 위한 이름을 지정해야한다.
    })
  ]
};

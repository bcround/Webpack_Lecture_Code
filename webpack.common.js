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
      // filename.module.scss => css modules, 이렇게 css파일 이름을 정의를 했을때 중간에 module이라는 글자가 들어가면, css modules가 적용이 되게 할 것이다. 그러면 module이 중간에 들어간 파일들의 class들은 지역화된 이름으로 변경이 되서 바뀌기 때문에 충돌하는 일이 발생하지 않는다.
      {
        // filename.scss => global, css module이 적용이 안된 global 형태가 되게끔 한다.
        test: /\.s?css$/,
        oneOf: [
          // oneOf키는 여러 rule중의 하나의 rule이 작용이 되게끔 조건을 걸어주는 역할을 한다.
          {
            test: /\.module\.s?css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true
                }
              },
              'sass-loader'
            ]
          },
          {
            // 첫번째 test (module.scss) 룰을 따르지 않는 경우는 모두 이 두번째 rule을 따른다 (module을 적용하지 않은 상태, global 범위).
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true
                }
              },
              'sass-loader'
            ]
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
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // limit키 값은 byte크기 단위의 숫자가 들어간다. 파일크기의 제한을 걸 수 있다. 8KB까지만 url loader를 적용하겠다. 파일크기가 너무 컸을때는 base64로 인코딩된 문자열 형태가 엄청 커질 수도 있다.
              limit: 8192 // 만약 파일크기가 limit을 걸어둔 값보다 넘게 되면, default로 file-loader를 사용한다. 혹은 options에 fallback이란 키로 무슨 loader를 사용할지 정해줄 수 있다.(alternative loader)
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

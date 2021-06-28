// __dirname, path module
// Node환경에서 제공하는 __dirname이라는 변수를 이용해 파일경로를 만든다.
// __dirname은 이 변수를 사용하고 있는 파일의 절대경로를 담고 있다.
// Node에서 제공하는 path라는 내장모듈도 사용한다.
// path라는 모듈은 파일경로를 쉽게 조작할 수 있도록 도와주는 기능이 있다.
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    // 번들 파일의 이름과 번들 파일이 생성되는 파일경로를 작성한다.
    filename: '[name].[chunkhash].js', // name이란 키워드는 entry파일 이름 혹은 웹팩 설정 파일 내에서 name프로퍼티에 할당한 값이 적용되는 공간이다.
    path: path.resolve(__dirname, 'dist') // 파일이 생성되는 경로이기 때문에 path 정보의 경우 절대경로로 설정해주어야한다.
  },
  module: {
    rules: [
      {
        test: /\.css$/i, // test는 어떤 파일들이 loader의 대상이 되는지 정규표현식을 통해 패턴매칭으로 설정할 수 있다.
        use: [
          // use는 사용하는 loader를 지정하는 loader 키와 loader의 동작을 변경할 수 있는 options라는 키를 사용한다.
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
            // css-loader의 options에서 modules라는 키가 있는데 이 키는 CSS Modules의 사용 여부를 설정한다.
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
      title: 'Webpack', // title의 대한 내용을 적용해볼텐데 title이라는 키를 추가하고 webpack이라는 글자를 넣어보자. 그러면 title값이 문서에 전달되게 된다.
      // title이 문서에 전달이 될때 handlebars를 사용하고 있고 Model이 데이터를 전달하게 될때 handlebars는 mustache({{}})로 표현을 한다.
      // mustache는 {{}}의 형태로 데이터가 전달되는 위치를 표현한다.
      // htmlWebpackPlugin을 통해서 전달이 될때는 template의 htmlWebpackPlugin.options라고하는 공간에 데이터들이 모두 전달이 되게 된다.
      // 그래서 htmlWebpackPlugin.options.title이라고 작성을해야 템플릿안으로 그 title값이 적용이 된다.
      // template.hbs파일로 가서 수정을 해보자.
      template: './template.hbs', // template의 경로를 .hbs로 바꿔주자.
      // meta라는 키도 있다. meta와 관련된 내용도 전달을 할 수가 있다. meta를 설정하게되면 meta tag를 자동으로 완성시켜 준다.
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
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
      // {
      // cache: true // 빠르게 build가 진행될 수 있도록 cache라는 키를 추가 하고 true값을 할당해준다. build가 반복적으로 진행될때 파일에 변화가 없으면 이전(캐싱된) 결과를 사용하면서 빌드시간을 줄여준다.
      // 하지만 Webpack v5에서 사용하는 TerserWebpackPlugin에서 cache라는 option이 없어지고 default로 설정되므로 따로 설정해줄 필요는 없다.
      // }
    ], // 이것만 작성하면 production mode에서만 작동한다.
    minimize: true // 그러므로 minimize값을 true로 주게되면 development mode에서도 CSS optimization이 된다. 또한 webpack 내부에서 terser를 실행시켜 압축을 진행한다.
  },
  mode: 'none'
};

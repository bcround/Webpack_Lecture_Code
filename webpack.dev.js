const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const config = {
  mode: 'development',
  devServer: {
    // open이란 옵션은 최초로 웹팩과 관련된 스크립트를 실행했을때 기본 브라우저가 함께 자동으로 실행된다.
    open: true, // true값을 설정하면 기본 브라우저로 지정된 브라우저에 새탭이 열리면서 웹어플리케이션이 실행된다.

    overlay: true, // overlay옵션은 에러메세지가 발생을 했을때 콘솔창이나 터미널에 있는 로그 값으로 확인하는 것이 아니라 에러메세지 자체가 화면에 나타나게 된다. CRA환경에서는 이 overlay 기본으로 적용되어 있기 때문에 React 어플리케이션을 만들때 오류메세지가 화면에 뜨던 것이다.

    // historyApiFallback는 라우팅과 관련된 키이다. 특정라우팅을 지정했을때 우리가 제공하지 않은 라우팅으로 갔을때 예외적인 처리를 하거나 특정한 라우팅은 특정한 html문서 지점으로 이동을 시키게끔 지정을 할 수 있다.
    // historyApiFallback키에 false값을 넣으면 사용을 하지 않는 상태를 나타낸다. false값일 때에는 우리가 아무 리소스도 지정해주지 않은 URL로 이동했을때 404에러가 뜬다. 이 상황에서 historyApi를 사용하면 특정라우팅때 특정지점으로 이동할 수 있는 Fallback처리를 할 수 있다.
    // historyApiFallback의 값이 true이면 특정라우팅을 지정하지 않는 주소로 이동을 해도 root directory에 있는 index.html 환경으로 이동을 시켜준다. 즉, 라우팅이 지원되지 않는 경로로 접근을 했을때 기본적으로 index.html파일로 이동시켜준다.
    // 보통 historyApiFallback 키 같은 경우는 SPA 같이 HTML5 History Api를 사용하는 경우에 설정을 하게 된다.
    // true값 말고도 객체를 할당할 수도 있다.
    historyApiFallback: {
      rewrites: [
        // rewrites 키는 여러가지 라우팅 설정들을 지정할 수 있고, 특정 지점으로 이동시킬 수 있다. 보통 정적사이트를 만들때 이런 처리를 많이 하는데, 웹팩을 사용하는 경우는 historyApiFallback으로 개발모드에서 이런 라우팅 설정을 하면 된다.
        { from: /^\/subpage$/, to: 'subpage.html' }, // from이랑 to라는 키가 있는데, from은 정규표현식 패턴매칭을 통해 라우팅에 대한 모습을 지정할 수 있다. to는 라우팅에 따라서 어디로 이동시킬지 이동 시키는 지점을 명시할 수 있다.
        { from: /./, to: '404.html' } // 특정 경로를 지정하지 않고, 특정 경로들을 제외한 모든 경로는 다 404 페이지를 따로만들어 제공할 수 있다. /./에서 .이 의미하는 것은 특정경로를 제외한 모든 경로를 의미한다.
      ]
    },
    port: 3333 // port키는 자동으로 설정되어 있는 8080 포트값을 임의의 포트값으로 수정할 수 있게 해준다. 보통 여러 프로젝트를 사용하다보면 포트번호가 충돌될 수 있기 때문에 가급적이면 작업하는 환경에 맞는 숫자패턴으로 수정하는것을 추천한다.
  }
};

module.exports = merge(common, config);

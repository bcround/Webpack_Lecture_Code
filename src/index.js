import 'normalize.css'; // import키만 사용하고 그뒤에 path의 값을 적어주면 모듈을 포함한 상태로 만들어 줄 수 있다.
import styles from './index.css'; // css는 선택자의 이름이 전역 환경으로 적용되기 때문에 어플리케이션 규모가 커졌을때도 선택자 이름의 충돌이 없도록 신경써줘야 하는데,
//CSS Modules라는 설정을 해주면, css파일을 모듈로 불러오고 class이름들을 자바스크립트 파일에 직접 불러와서 사용할 수 있다.
// 그래서 CSS Modules 설정을 하면 css파일별로 클래스 이름이 같아도 겹치지 않는다는 장점이 있다.
import $ from 'jquery';
import slackImg from './assets/slack_logo.jpeg';

function component() {
  const element = document.createElement('div');
  element.innerHTML = 'Hello Webpack';

  const imgElement = document.createElement('img');
  imgElement.src = slackImg;

  console.log(styles); //{helloWebpack: "Xsm8tCif7FknljylODIGx"}, css파일에 있는 클래스 이름이 객체 키로 전달이 되고 키의 값은 변형된 해시값이 할당된다.

  console.log(slackImg);
  element.appendChild(imgElement);

  element.classList = styles.helloWebpack;

  return element;
}

document.body.appendChild(component());
console.log($(`${styles.helloWebpack}`).length);
console.log(`IS_PRODUCTION MODE: ${IS_PRODUCTION}`);

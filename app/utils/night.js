'use strict';
/* eslint no-console:0 */
/* eslint-env browser */
const nightmare1 = require('nightmare');
const log = require('rainbowlog');
const co = require('co');
const Captcha = require('./captcha-recognizer');
const Exception = require('./exception');
let nightmare = nightmare1();

const usernameBox = '.mutiview-dialog-content .LoginForm .view.login .input-wrapper input[name=account]';
const passwordBox = '.mutiview-dialog-content .LoginForm .view.login .input-wrapper input[name=password]';
const submitBox = '.actions .submit.blue-button';
const captchaBox = '.mutiview-dialog-content .LoginForm .view.login .input-wrapper input#captcha';
const captchaImgBox = '.mutiview-dialog-content .LoginForm .view.login .input-wrapper .captcha-container .js-refreshCaptcha.captcha';
const userinfoBox = '.zu-top-nav-userinfo';
const WAIT_TIMEOUT = 300000;
const RETRY_LIMIT = 3;
co(function *() {
  yield login();
});

function *login() {
  nightmare.on('page', (type = 'error', message, stack) => {
    console.log('message-error', message);
    console.log('stack-error', stack);
  });
  log.trace('进入网站https://www.zhihu.com/question/52833602');
  yield nightmare.goto('https://www.zhihu.com/question/52833602').wait('body');
  log.trace('点击我要回答按钮！');
  yield nightmare.click('a.zg-r3px');
  yield nightmare.wait('.mutiview-dialog.SignFlow');
  log.trace('点击登录按钮！');
  yield nightmare.click('.mutiview-dialog-content .view.register .sns .switch-to-login');
  yield nightmare.wait('.mutiview-dialog.SignFlow.login.show');
  // yield nightmare.evaluate((selector, value) => {
  //   const ele = document.querySelector(selector);
  //   if (ele) {
  //     ele.value = value;
  //   }
  //   return document.querySelector(selector).innerText;
  // }, '.mutiview-dialog-title .title.login', '');
  yield nightmare.type(usernameBox, '15757118234');
  yield nightmare.type(usernameBox, 'pzpz1314');
  log.trace('再次点击登录按钮！');
  yield nightmare.click(submitBox);
  const status = yield getLoginSubmitStatus(nightmare);
  log.trace(`点击登录按钮后获取状态${status}`);
  switch (status) {
    case 'verify_code':
      yield putLoginVerifyCode(nightmare);
      break;
    case 'login_ok':
      return;
    default: break;
  }
  // yield nightmare.evaluate((usernameBox, passwordBox, submitBox) => {
  //   return document.querySelector(usernameBox).value + document.querySelector(passwordBox).value + document.querySelector(submitBox).value;
  // }, usernameBox, passwordBox, submitBox)
  // .end()
  // .then((username) => {
  //   console.log('===>', username);
  // });
  yield nightmare.click(submitBox);
  log.trace('再次点击登录按钮');
  yield nightmare.wait('body');
  yield nightmare.exists(userinfoBox);
  log.trace('登录成功！');
  // yield nightmare.evaluate((usernameBox) => {
  //   return document.querySelector(usernameBox).innerText;
  // }, '.toggle-comment.meta-item')
  // .end()
  // .then((username) => {
  //   console.log('===>', username);
  // });
  yield nightmare.click('.toggle-comment.meta-item');
  log.debug('点击评论按钮');
  yield nightmare.wait(40000);
  yield nightmare.wait('.zm-comment-box.empty');
  yield nightmare.insert('.zm-comment-editable.editable', '我自己的测试成功？？？');
  log.debug('写入评论');
  yield nightmare.click('.zg-right.zg-btn-blue');
  log.debug('点击提交评论按钮');
  yield nightmare.wait('body');
}

function *getLoginSubmitStatus(nightmare) {
  if (!(yield nightmare.visible(submitBox))) {
    return 'login_ok';
  } else {
    return 'verify_code';
  }
}

function *putLoginVerifyCode(nightmare) {
  const code = yield recognizeCaptcha(captchaImgBox, {
    type: Captcha.DW,
    length: 4,
  }, nightmare);
  yield nightmare.insert(captchaBox, code);
}
/**
 * [description]
 * @param  {string} selector  [description]
 * @param  {{type: enum, length: number}} options   [description]
 * @return {string}           [description]
 */
function *recognizeCaptcha(selector, options, nightmare) {
  let bounds;
  bounds = yield getBounds(selector, nightmare);
  yield isImageLoaded(selector, nightmare);
  // yield waitCondition(function *() {
  //   bounds = yield getBounds(selector, nightmare);
  //   return yield isImageLoaded(selector, nightmare);
  // }, nightmare);
  const buf = yield nightmare.screenshot(null, bounds);
  return yield Captcha(buf, 'png', options.type, options.length);
}

function *getBounds(selector, nightmare) {
  return yield nightmare.evaluate(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }
  }, selector);
}

function *isImageLoaded(selector, nightmare) {
  return yield nightmare.evaluate(selector => {
    const img = document.querySelector(selector);
    if (!img) {
      return false;
    }
    return img.complete;
  }, selector);
}

// function *waitCondition(condition, timeout, nightmare) {
//   if (timeout == null) {
//     timeout = WAIT_TIMEOUT;
//   }
//   const expire = Date.now() + timeout;
//   while (Date.now() < expire) {
//     nightmare.wait(200);
//     if (yield condition.call(nightmare)) {
//       return;
//     }
//   }
//   throw new Exception(Exception.OperationTimeout);
// }

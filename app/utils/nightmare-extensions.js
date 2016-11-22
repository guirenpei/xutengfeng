'use strict';
/* eslint no-console: 0 */
/* eslint-env browser */

const log = require('rainbowlog');
const co = require('co');
const capt = require('./captcha-recognizer');
const Exception = require('./exception');
const conf = require('../config');

const WAIT_TIMEOUT = conf.waitTimeout || 20000;
const RETRY_LIMIT = conf.retryLimit || 3;

/**
 * [description]
 * @param  {string} selector  [description]
 * @param  {{type: enum, length: number}} options   [description]
 * @return {string}           [description]
 */
exports.recognizeCaptcha = function *(selector, options) {
  let bounds;
  yield this.waitCondition(function *() {
    bounds = yield this.getBounds(selector);
    return yield this.isImageLoaded(selector);
  });
  const buf = yield this.screenshot(null, bounds);
  return yield capt(buf, 'png', options.type, options.length);
};

exports.getBounds = function *(selector) {
  return yield this.evaluate(selector => {
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
};

exports.isImageLoaded = function *(selector) {
  return yield this.evaluate(selector => {
    const img = document.querySelector(selector);
    if (!img) {
      return false;
    }
    return img.complete;
  }, selector);
};

exports.retry = function *(action, retryLimit, timeout) {
  if (retryLimit == null) {
    retryLimit = RETRY_LIMIT;
  }
  if (timeout == null) {
    timeout = WAIT_TIMEOUT;
  }
  let exception = null;
  while (retryLimit-- > 0) {
    try {
      return yield this.runTimeout(function *() {
        return yield action.call(this);
      }, timeout);
    } catch (err) {
      exception = err;
      log.warn(`bot-funcs.retry meet error (${err.message || err}), try again (${retryLimit} times left).`);
    }
  }
  if (exception != null) {
    throw exception;
  }
  throw new Exception(Exception.ExceedRetryLimit, '不知为啥，反正是跑到这一句了 (bot-funcs.retry)');
};

exports.waitCondition = function *(condition, timeout) {
  if (timeout == null) {
    timeout = WAIT_TIMEOUT;
  }
  const expire = Date.now() + timeout;
  while (Date.now() < expire) {
    this.wait(200);
    if (yield condition.call(this)) {
      return;
    }
  }
  throw new Exception(Exception.OperationTimeout);
};

exports.waitMultiCondition = function *(conditions, timeout) {
  if (timeout == null) {
    timeout = WAIT_TIMEOUT; // default 10s.
  }
  const expire = Date.now() + timeout;
  while (Date.now() < expire) {
    this.wait(200);
    for (const cond in conditions) {
      if (conditions.hasOwnProperty(cond)) {
        if (yield conditions[cond].call(this)) {
          return cond;
        }
      }
    }
  }
  throw new Exception(Exception.OperationTimeout);
};

exports.getMultiText = function *(selectors) {
  const result = {};
  for (const key in selectors) {
    if (!selectors.hasOwnProperty(key)) {
      continue;
    }
    const value = yield this.evaluate((selector) => {
      const ele = document.querySelector(selector);
      if (ele) {
        return ele.innerText;
      }
      return '';
    }, selectors[key]);
    result[key] = value;
  }
  return result;
};

exports.remove = function *(selector) {
  yield this.evaluate((selector) => {
    Array.from(document.querySelectorAll(selector)).forEach(e => {
      if (e.parentNode) {
        e.parentNode.removeChild(e);
      }
    });
  }, selector);
};

exports.hide = function *(selector) {
  yield this.evaluate((selector) => {
    const ele = document.querySelector(selector);
    if (ele) {
      ele.style.display = 'none';
    }
  }, selector);
};

exports.getAttribute = function *(selector, attributeName) {
  return yield this.evaluate((selector, attributeName) => {
    const ele = document.querySelector(selector);
    if (ele) {
      return ele.getAttribute(attributeName);
    }
  }, selector, attributeName);
};

exports.retryGoto = function *(url, retryLimit) {
  if (retryLimit == null) {
    retryLimit = RETRY_LIMIT;
  }
  return yield this.retry(function *() {
    yield this.goto(url).wait('body');
  }, retryLimit);
};

exports.retryRecognizeCaptcha = function *(selectors, options, retryLimit) {
  if (retryLimit == null) {
    retryLimit = RETRY_LIMIT;
  }
  return yield this.retry(function *() {
    log.info('开始获取验证码...');
    const code = yield this.recognizeCaptcha(selectors.imgSelector, options);
    log.info('获取了验证码：', code);
    yield this.evaluate((inputSelector, code) => {
      const ele = document.querySelector(inputSelector);
      if (ele) {
        ele.value = code;
      }
    }, selectors.inputSelector, code);
    yield this.click(selectors.submitSelector);
    return yield this.waitCondition(function *() {
      return yield this.exists(selectors.imgSelector);
    });
  }, RETRY_LIMIT);
};

exports.runTimeout = function *(action, timeout) {
  if (timeout == null) {
    timeout = 20000;
  }
  return yield Promise.race([
    co.wrap(action).call(this),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Exception(Exception.OperationTimeout));
      }, timeout);
    }),
  ]);
};

exports.recognizeCaptchaInIframe = function *(iframeSelector, selector, options) {
  let bounds;
  yield this.waitCondition(function *() {
    bounds = yield this.getBoundsInIframe(iframeSelector, selector);
    log.info('获取验证码区域', bounds);
    return yield this.isImageLoadedInIframe(iframeSelector, selector);
  });
  const buf = yield this.screenshot(null, bounds);
  return yield capt(buf, 'png', options.type, options.length);
};

exports.getBoundsInIframe = function *(iframeSelector, selector) {
  return yield this.evaluate((iframeSelector, selector) => {
    const iframe = document.querySelector(iframeSelector);
    const iframeRect = iframe.getBoundingClientRect();
    console.log(iframeRect);
    if (!iframe) {
      return;
    }
    const element = iframe.contentDocument.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      console.log(rect)
      return {
        x: Math.round(iframeRect.left + rect.left),
        y: Math.round(iframeRect.top + rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }
  }, iframeSelector, selector);
};

exports.isImageLoadedInIframe = function *(iframeSelector, selector) {
  return yield this.evaluate((iframeSelector, selector) => {
    const iframe = document.querySelector(iframeSelector);
    if (!iframe) {
      return false;
    }
    const img = iframe.contentDocument.querySelector(selector);
    if (!img) {
      return false;
    }
    return img.complete;
  }, iframeSelector, selector);
};

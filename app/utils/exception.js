'use strict';


const codes = {
  Unknown: 1,
  UserBanned: 2,
  NoUser: 3,
  NoSuchBot: 4,
  CannotLogout: 5,
  CannotLogin: 6,
  LoginFailed: 7,
  LoginError: 8,
  OperationTimeout: 9,
  ExceedRetryLimit: 10,
  NoReply: 11,
  NineVerifyCode: 12,
  UnknownBox: 13,
  UnknownBotType: 14,
  ExceedFrequencyLimit: 15,
};

const defaultMessage = {
  [codes.Unknown]: 'Unknown',
  [codes.UserBanned]: '用户被封禁',
  [codes.NoUser]: '没有更多可用用户',
  [codes.NoSuchBot]: '所指定的bot不存在。',
  [codes.CannotLogout]: '无法注销。',
  [codes.CannotLogin]: '无法登录，已经登录',
  [codes.LoginFailed]: '登录失败',
  [codes.LoginError]: '登录出错',
  [codes.OperationTimeout]: '操作超时',
  [codes.ExceedRetryLimit]: '超过重试次数',
  [codes.NoReply]: '没有取到回复信息',
  [codes.NineVerifyCode]: '无法识别九宫格的验证码',
  [codes.UnknownBox]: '回复时，弹出了不明弹框',
  [codes.UnknownBotType]: '未知的机器人类型',
  [codes.ExceedFrequencyLimit]: '发帖频率超过限制',
};

class Exception extends Error {
  constructor(code, msg) {
    super(msg || defaultMessage[code] || 'Unknown');
    this.code = code;
    this.message = `[${code}] ${msg || defaultMessage[code] || 'Unknown'}`;
    Error.captureStackTrace(this, Exception);
  }
}

function wrap(err) {
  const stack = err.stack;
  const exception = new Exception(codes.Unknown, err.message || 'Unknown');
  exception.stack = stack;
  return exception;
}

module.exports = Object.assign(Exception, codes, {wrap});

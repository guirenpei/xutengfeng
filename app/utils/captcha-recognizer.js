'use strict';

const rest = require('restler');

const types = {
  D: 1, // 0-9
  W: 2, // A-Z (case insensitive)
  DW: 3, // 0-9A-Z
  C: 4, // 中文
  DWC: 5, // 中文0-9A-Z 混合
};

function makeTypeId(type, number) {
  const t = type;
  const n = padToLeft(number, 2, '0');
  return `${t}${n}0`;

  function padToLeft(x, n, p) {
    let s = `${x}`;
    while (s.length < n) {
      s = `${p}${x}`;
    }
    return s;
  }
}

function request(binary, _extension, _type, _number) {
  const extension = _extension.replace(/^\./, '');
  const type = (_type != null && _type <= 5) ? _type : types.DW;
  const number = (_number != null && _number <= 10) ? _number : 0;
  return new Promise((resolve, reject) => {
    rest.post('http://api.ruokuai.com/create.json', {
      multipart: true,
      data: {
        username: 'linkang',
        password: 'leo123456',
        typeid: makeTypeId(type, number),
        softid: '59632',
        softkey: '0f4622a3a5b4467c8620e823e08d4cf2',
        image: rest.data(`${Date.now()}.${extension}`, `image/${extension}`, binary),
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).on('complete', data => {
      if (data instanceof Error) {
        reject(data);
      } else {
        const captcha = JSON.parse(data);
        resolve(captcha.Result);
      }
    });
  });
}

module.exports = Object.assign(request, types);

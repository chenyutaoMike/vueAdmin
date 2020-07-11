/**
 * 过滤特殊字符
 */

export function stripscript(str) {
  if (typeof str === 'number') {
    str = String(str)
  }
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]. <>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '');
  }
  console.log(rs)
  return rs;
}

export function validateEmail(value) {
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

export function validatePass(value) {
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

export function validateVCode(value) {
  let reg = /^[a-z0-9A-Z]{6}$/;
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

export function extractCode(code) {
  let reg = /：([a-zA-Z0-9]+)/;
  return reg.exec(code)[1];
}